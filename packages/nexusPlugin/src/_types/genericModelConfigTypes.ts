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
}

export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    access?: AccessRule[]
}
