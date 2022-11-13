export type ApiConfig = {
  User?: UserModelConfiguration
  Car?: CarModelConfiguration
}

export type AccessRule = {
  applyToCreate?: boolean
  applyToRead?: boolean
  applyToUpdate?: boolean
  applyToDelete?: boolean
  rule: any
}

export type ModelDeleteConfiguration = {
  disabled?: boolean
}

export type UserModelCreateConfiguration = {
  disabled?: boolean
  removedFields?: UserFields[]
}

export type UserModelReadConfiguration = {
  disabled?: boolean
  removedFields?: UserFields[]
}

export type UserModelUpdateConfiguration = {
  disabled?: boolean
  removedFields?: UserFields[]
}

export type UserModelConfiguration = {
  create?: UserModelCreateConfiguration
  read?: UserModelReadConfiguration
  update?: UserModelUpdateConfiguration
  delete?: ModelDeleteConfiguration
  access?: AccessRule[]
}

export type CarModelCreateConfiguration = {
  disabled?: boolean
  removedFields?: CarFields[]
}

export type CarModelReadConfiguration = {
  disabled?: boolean
  removedFields?: CarFields[]
}

export type CarModelUpdateConfiguration = {
  disabled?: boolean
  removedFields?: CarFields[]
}

export type CarModelConfiguration = {
  create?: CarModelCreateConfiguration
  read?: CarModelReadConfiguration
  update?: CarModelUpdateConfiguration
  delete?: ModelDeleteConfiguration
  access?: AccessRule[]
}

export type UserFields = 'id' | 'email' | 'name'

export type CarFields = 'id' | 'color' | 'maxSpeed'
