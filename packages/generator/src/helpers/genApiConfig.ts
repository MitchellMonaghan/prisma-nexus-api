import path from 'path'
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

        content += (i === 0 ? '' : '\n') + `export type ${modelName}Fields = `
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
        content += (i === 0 ? '' : '\n') + `
export type ${modelName}ModelCreateConfiguration = ModelCreateConfiguration & {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelReadConfiguration = ModelReadConfiguration & {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelUpdateConfiguration = ModelUpdateConfiguration & {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelConfiguration = ModelConfiguration & {
    create?: ${modelName}ModelCreateConfiguration,
    read?: ${modelName}ModelReadConfiguration,
    update?: ${modelName}ModelUpdateConfiguration,
    delete?: ModelDeleteConfiguration,
    access?: AccessRule[]
}`
    }

    return content
}

export const genApiConfig = async (outputPath:string, datamodel: DMMF.Datamodel) => {
    const apiConfigPath = path.join(outputPath, 'ApiConfig.ts')

    let contents = genApiConfigType(datamodel.models)
    contents += '\n' + `
export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    access?: AccessRule[]
}

export type ModelCreateConfiguration = {
    disabled?: boolean
    removedFields?: string[]
}

export type ModelReadConfiguration = {
    disabled?: boolean
    removedFields?: string[]
}

export type ModelUpdateConfiguration = {
    disabled?: boolean
    removedFields?: string[]
}

export type ModelDeleteConfiguration = {
    disabled?: boolean
}

export type AccessRule = {
    applyToCreate?: boolean,
    applyToRead?: boolean,
    applyToUpdate?: boolean,
    applyToDelete?: boolean,
    rule: any
}`
    contents += '\n' + genModelConfigTypes(datamodel.models)
    contents += '\n\n' + genFieldTypes(datamodel.models)

    await writeFileSafely(apiConfigPath, contents)
}
