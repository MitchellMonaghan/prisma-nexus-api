export type ApiConfig = {
  User?: UserModelConfiguration
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

export type UserFields = 'id' | 'email' | 'name'
