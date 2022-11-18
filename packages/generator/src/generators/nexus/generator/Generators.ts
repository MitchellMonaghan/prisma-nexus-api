import { Mutation, Query, QueriesAndMutations, DMMF } from '@paljs/types'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { format, Options as PrettierOptions } from 'prettier'
import { join } from 'path'
import { getInputType, getEnvPaths, tryLoadEnvs, getDMMF } from '@paljs/utils'

import { ApiConfig } from '../../../_types'

const projectRoot = process.cwd()

type GeneratorOptions = {
  apiConfig: ApiConfig;

  backAsText?: boolean;
  prismaName: string;
  models?: string[];
  output: string;
  javaScript?: boolean;
  excludeFields: string[];
  excludeModels: { name: string; queries?: boolean; mutations?: boolean }[];
  disableTypes?: boolean;
  disableInputTypes?: boolean;
  disableQueries?: boolean;
  disableMutations?: boolean;
  excludeFieldsByModel: { [modelName: string]: string[] };
  excludeQueriesAndMutationsByModel: {
    [modelName: string]: QueriesAndMutations[];
  };
  excludeQueriesAndMutations: QueriesAndMutations[];
  excludeInputFields?: string[];
  filterInputs?: (input: DMMF.InputType) => DMMF.SchemaArg[];
  doNotUseFieldUpdateOperationsInput?: boolean;
}

export class Generators {
  private schemaPath: string
  public options: GeneratorOptions = {
    apiConfig: {},
    prismaName: 'prisma',
    output: join(projectRoot, 'src/graphql'),
    excludeFields: [],
    excludeModels: [],
    excludeInputFields: [],
    excludeFieldsByModel: {},
    excludeQueriesAndMutations: [],
    excludeQueriesAndMutationsByModel: {}
  }

  isJS?: boolean = false
  inputName = 'InputTypes'

  queries: Query[] = ['findUnique', 'findFirst', 'findMany', 'findCount', 'aggregate']
  mutations: Mutation[] = ['createOne', 'updateOne', 'upsertOne', 'deleteOne', 'updateMany', 'deleteMany']

  schemaString: string

  readyDmmf?: DMMF.Document

  constructor (schemaPath: string, customOptions?: Partial<GeneratorOptions>) {
    this.schemaPath = schemaPath
    this.options = { ...this.options, ...customOptions }
    this.isJS = this.options.javaScript
    this.schemaString = readFileSync(this.schemaPath, 'utf-8')
    tryLoadEnvs(getEnvPaths())
  }

  protected async dmmf (): Promise<DMMF.Document> {
    if (!this.readyDmmf) {
      this.readyDmmf = await getDMMF({ datamodel: this.schemaString })
      return this.readyDmmf
    } else {
      return this.readyDmmf
    }
  }

  protected async datamodel () {
    const { datamodel }: { datamodel: DMMF.Datamodel } = await this.dmmf()
    return datamodel
  }

  protected dataModel (models: DMMF.Model[], name: string) {
    return models.find((m) => m.name === name)
  }

  protected dataField (name: string, model?: DMMF.Model) {
    return model?.fields.find((f) => f.name === name)
  }

  protected async models () {
    const { schema }: { schema: DMMF.Schema } = await this.dmmf()
    return schema.outputObjectTypes.model.filter(
      (model) => !this.options.models || this.options.models.includes(model.name)
    )
  }

  async getInputTypes (typeName: string, fieldName: string, sdl = true) {
    const { schema }: { schema: DMMF.Schema } = await this.dmmf()
    const field = schema.outputObjectTypes.prisma
      .find((type) => type.name === typeName)
      ?.fields.find((field) => field.name === fieldName)
    if (!field) return ''
    return sdl ? this.getSDLArgs(field.args) : this.getNexusArgs(field.args)
  }

  getNexusArgs (args: DMMF.SchemaArg[]) {
    const getType = (arg: DMMF.SchemaArg) => {
      let type = `'${arg.inputTypes[0].type}'`

      if (arg.inputTypes[0].isList) {
        type = `list(${type})`
      }

      if (arg.isRequired) {
        type = `nonNull(${type})`
      }
      return type
    }
    const argsText: string[] = ['args: {']
    args.forEach((arg) => {
      argsText.push(`${arg.name}: ${getType(arg)},`)
    })
    argsText.push('},')
    return argsText.join('\n')
  }

  getSDLArgs (args: DMMF.SchemaArg[]) {
    const getType = (arg: DMMF.SchemaArg) => {
      let type = `${arg.inputTypes[0].type}`

      if (arg.isRequired) {
        type = `${type}!`
      }

      if (arg.inputTypes[0].isList) {
        type = `[${type}]`
      }

      return type
    }
    const argsText: string[] = []
    args.forEach((arg) => {
      argsText.push(`${arg.name}: ${getType(arg)}`)
    })
    return argsText.join('\n')
  }

  protected withExtension (filename: string) {
    return filename + (this.isJS ? '.js' : '.ts')
  }

  protected excludeFields (model: string) {
    return this.options.excludeFields.concat(this.options.excludeFieldsByModel[model])
  }

  protected disableQueries (model: string) {
    return (
      this.options.disableQueries || !!this.options.excludeModels.find((item) => item.name === model && item.queries)
    )
  }

  protected disableMutations (model: string) {
    return (
      this.options.disableMutations ||
      !!this.options.excludeModels.find((item) => item.name === model && item.mutations)
    )
  }

  protected smallModel (name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1)
  }

  protected upperModel (name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  protected excludedOperations (model: string) {
    return this.options.excludeQueriesAndMutations.concat(this.options.excludeQueriesAndMutationsByModel[model] ?? [])
  }

  protected mkdir (path: string) {
    !existsSync(path) && mkdirSync(path, { recursive: true })
  }

  protected output (...paths: string[]): string {
    return join(this.options.output, ...paths)
  }

  protected getIndexContent (files: string[], oldFilePath?: string) {
    const oldFileContent = oldFilePath ? this.readFile(oldFilePath) : ''
    const lines: string[] = []
    if (this.isJS) lines.push('module.exports = {')
    files.forEach((file) => {
      if (this.isJS) {
        lines.push(`  ...require('./${file}'),`)
      } else if (!oldFileContent.includes(`export * from './${file}'`)) {
        lines.push(`export * from './${file}'`)
      }
    })
    if (this.isJS) {
      lines.push('}')
      return lines.join('\n')
    } else {
      lines.push(oldFileContent)
      return lines.join('\n')
    }
  }

  async generateSDLInputsString () {
    const { schema }: { schema: DMMF.Schema } = await this.dmmf()
    const fileContent: string[] = ['scalar DateTime', 'type BatchPayload {', 'count: Int!', '}', '']
    if (schema) {
      const enums = [...schema.enumTypes.prisma]
      if (schema.enumTypes.model) enums.push(...schema.enumTypes.model)
      enums.forEach((item) => {
        fileContent.push(`enum ${item.name} {`)
        item.values.forEach((item2) => {
          fileContent.push(item2)
        })
        fileContent.push('}', '')
      })
      const inputObjectTypes = [...schema.inputObjectTypes.prisma]
      if (schema.inputObjectTypes.model) inputObjectTypes.push(...schema.inputObjectTypes.model)

      inputObjectTypes.forEach((input) => {
        const inputFields =
          typeof this.options?.filterInputs === 'function' ? this.options.filterInputs(input) : input.fields
        if (inputFields.length > 0) {
          fileContent.push(`input ${input.name} {`, '')
          inputFields
            .filter((field) => !this.options?.excludeInputFields?.includes(field.name))
            .forEach((field) => {
              const inputType = getInputType(field, this.options)

              fileContent.push(
                `${field.name}: ${inputType.isList ? `[${inputType.type}!]` : inputType.type}${
                  field.isRequired ? '!' : ''
                }`
              )
            })
          fileContent.push('}', '')
        }
      })

      schema?.outputObjectTypes.prisma
        .filter((type) => type.name.includes('Aggregate') || type.name.endsWith('CountOutputType'))
        .forEach((type) => {
          fileContent.push(`type ${type.name} {`, '')
          type.fields
            .filter((field) => !this.options?.excludeInputFields?.includes(field.name))
            .forEach((field) => {
              fileContent.push(
                `${field.name}: ${field.outputType.isList ? `[${field.outputType.type}!]` : field.outputType.type}${
                  !field.isNullable ? '!' : ''
                }`
              )
            })
          fileContent.push('}', '')
        })
    }
    return this.formation(fileContent.join('\n'), 'graphql')
  }

  protected readFile (path: string) {
    return existsSync(path) ? readFileSync(path, { encoding: 'utf-8' }) : ''
  }

  protected getImport (content: string, path: string) {
    return this.isJS ? `const ${content} = require('${path}')` : `import ${content} from '${path}'`
  }

  protected filterDocs (docs?: string) {
    return docs?.replace(/@PrismaSelect.map\(\[(.*?)\]\)/, '').replace(/@onDelete\((.*?)\)/, '')
  }

  protected shouldOmit (docs?: string) {
    if (!docs?.includes('@Pal.omit')) {
      return false
    }
    if (docs?.match(/@Pal.omit(\(\))?\b/)) {
      return true
    }
    const innerExpression = docs?.match(/@Pal.omit\(\[(.*?)\]\)/)
    if (innerExpression) {
      const expressionArguments = innerExpression[1].replace(/\s/g, '').split(',').filter(Boolean)
      return expressionArguments.includes('output')
    }
    return false
  }

  protected createFileIfNotfound (path: string, fileName: string, content: string) {
    !existsSync(path) && this.mkdir(path)
    !existsSync(join(path, fileName)) && writeFileSync(join(path, fileName), content)
  }

  protected get parser () {
    return this.isJS ? 'babel' : 'babel-ts'
  }

  formation (text: string, parser: PrettierOptions['parser'] = this.parser) {
    return format(text, {
      singleQuote: true,
      semi: false,
      trailingComma: 'all',
      parser
    })
  }
}
