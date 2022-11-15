export type ApiConfig = {
	User?: UserModelConfiguration
	Car?: CarModelConfiguration
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
}

export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    access?: AccessRule[]
}

export type UserModelCreateConfiguration = ModelCreateConfiguration & {
    disabled?: boolean
    removedFields?: UserFields[]
}

export type UserModelReadConfiguration = ModelReadConfiguration & {
    disabled?: boolean
    removedFields?: UserFields[]
}

export type UserModelUpdateConfiguration = ModelUpdateConfiguration & {
    disabled?: boolean
    removedFields?: UserFields[]
}

export type UserModelConfiguration = ModelConfiguration & {
    create?: UserModelCreateConfiguration,
    read?: UserModelReadConfiguration,
    update?: UserModelUpdateConfiguration,
    delete?: ModelDeleteConfiguration,
    access?: AccessRule[]
}

export type CarModelCreateConfiguration = ModelCreateConfiguration & {
    disabled?: boolean
    removedFields?: CarFields[]
}

export type CarModelReadConfiguration = ModelReadConfiguration & {
    disabled?: boolean
    removedFields?: CarFields[]
}

export type CarModelUpdateConfiguration = ModelUpdateConfiguration & {
    disabled?: boolean
    removedFields?: CarFields[]
}

export type CarModelConfiguration = ModelConfiguration & {
    create?: CarModelCreateConfiguration,
    read?: CarModelReadConfiguration,
    update?: CarModelUpdateConfiguration,
    delete?: ModelDeleteConfiguration,
    access?: AccessRule[]
}

export type UserFields = 'id' | 'email' | 'name'
export type CarFields = 'id' | 'color' | 'maxSpeed'