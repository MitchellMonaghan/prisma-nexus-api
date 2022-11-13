import path from 'path'
import dedent from 'ts-dedent'
import { DMMF } from '@prisma/generator-helper'
import { writeFileSafely } from '../utils/writeFileSafely'

const genApiConfigType = (models: DMMF.Model[]) => {
    const modelNames = models.map(m => m.name)

    let content = 'export type ApiConfig = {'

    for (let i = 0; i < modelNames.length; i++) {
        const modelName = modelNames[i]
        content += `\n\t${modelName}?: ${modelName}ModelConfiguration`
    }

    content += '\n}'

    return content
}

const genFieldTypes = (models: DMMF.Model[]) => {
    let content = ''
    for (let i = 0; i < models.length; i++) {
        const model = models[i]
        const modelName = model.name

        content += (i === 0 ? '' : '\n\n') + `export type ${modelName}Fields = `
        for(let j = 0; j < model.fields.length; j++) {
            const field = model.fields[j]
            content += (j === 0 ? '' : ' | ') + `'${field.name}'`
        }
    }

    return content
}

const genModelConfigTypes = (models: DMMF.Model[]) => {
    const modelNames = models.map(m => m.name)

    let content = ''
    for (let i = 0; i < modelNames.length; i++) {
        const modelName = modelNames[i]
        content += (i === 0 ? '' : '\n\n') + dedent`
        export type ${modelName}ModelCreateConfiguration = {
            disabled?: boolean
            removedFields?: ${modelName}Fields[]
        }

        export type ${modelName}ModelReadConfiguration = {
            disabled?: boolean
            removedFields?: ${modelName}Fields[]
        }

        export type ${modelName}ModelUpdateConfiguration = {
            disabled?: boolean
            removedFields?: ${modelName}Fields[]
        }
    
        export type ${modelName}ModelConfiguration = {
            create?: ${modelName}ModelCreateConfiguration,
            read?: ${modelName}ModelReadConfiguration,
            update?: ${modelName}ModelUpdateConfiguration,
            delete?: ModelDeleteConfiguration,
            access?: AccessRule[]
        }
        `
    }

    return content
}

export const genApiConfig = async (outputPath:string, datamodel: DMMF.Datamodel) => {
    const apiConfigPath = path.join(outputPath, 'ApiConfig.ts')

    let contents = genApiConfigType(datamodel.models)
    contents += dedent`\n\n
    export type AccessRule = {
        applyToCreate?: boolean,
        applyToRead?: boolean,
        applyToUpdate?: boolean,
        applyToDelete?: boolean,
        rule: any
    }
    
    export type ModelDeleteConfiguration = {
        disabled?: boolean
    }`
    contents += '\n\n' + genModelConfigTypes(datamodel.models)
    contents += '\n\n' + genFieldTypes(datamodel.models)

    await writeFileSafely(apiConfigPath, contents)
}
