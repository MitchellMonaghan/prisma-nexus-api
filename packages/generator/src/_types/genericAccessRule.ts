// Property Selectors
// and
// or
// not
// exists
// modelFields (id, email, name etc)
// sessionProp

// Operators
// column (ceq, cgte etc operators, price > quantity)

// const example = {
//   property: 'id',
//   operator: 'eq',
//   value: '1342124314'
// }

export type StringOperatorOptions = 'eq' | 'neq' | 'in' | 'nin' | 'contains' | 'ncontains' | 'regex' | 'nregex'
export type NumberOperatorOptions = 'eq' | 'neq' | 'gt' |'lt' |'gte' |'lte' | 'in' | 'nin'
export type BooleanOperatorOptions = 'eq' | 'neq' | 'in' | 'nin'
export type DateOperatorOptions = 'eq' | 'neq' | 'gt' |'lt' |'gte' |'lte' | 'in' | 'nin'

// Equal
type EqualOperator<T> = {
    name: 'eq'
    value: T
}
type NotEqualOperator<T> = {
    name: 'neq'
    value: T
}

// Numeric compare
type GreaterThanOperator<T extends (number|Date)> = {
    name: 'gt'
    value: T
}
type GreaterThanOrEqualOperator<T> = {
    name: 'gte'
    value: T
}
type LessThanOperator<T> = {
    name: 'lt'
    value: T
}
type LessThanOrEqualOperator<T> = {
    name: 'lte'
    value: T
}

// List
type InOperator<T> = {
    name: 'in'
    value: T[] | string
}
type NotInOperator<T> = {
    name: 'nin'
    value: T[] | string
}
type ContainsOperator<T> = {
    name: 'contains'
    value: T
}
type NotContainsOperator<T> = {
    name: 'ncontains'
    value: T
}

// Regex
type RegexOperator = {
    name: 'regex'
    value: string
}
type NotRegexOperator = {
    name: 'nregex'
    value: string
}

type StringOperators = EqualOperator<string> | NotEqualOperator<string> | InOperator<string> | NotInOperator<string> | ContainsOperator<string> | NotContainsOperator<string> | RegexOperator | NotRegexOperator
type NumberOperators = EqualOperator<number> | NotEqualOperator<number> | GreaterThanOperator<number> | GreaterThanOrEqualOperator<number> | LessThanOperator<number> | LessThanOrEqualOperator<number> | InOperator<number> | NotInOperator<number>
type BooleanOperators = EqualOperator<boolean> | NotEqualOperator<boolean> | InOperator<number> | NotInOperator<number>
type DateOperators = EqualOperator<Date> | NotEqualOperator<Date> | GreaterThanOperator<Date> | GreaterThanOrEqualOperator<Date> | LessThanOperator<Date> | LessThanOrEqualOperator<Date> | InOperator<Date> | NotInOperator<Date>

export type AccessRule = {
    property: string
    operator: StringOperators | NumberOperators | BooleanOperators| DateOperators
}

export type NumberAccessRule = AccessRule & {
    operator: NumberOperators
}

export type StringAccessRule = AccessRule & {
    operator: StringOperators
}

export type BooleanAccessRule = AccessRule & {
    operator: BooleanOperators
}

export type DateAccessRule = AccessRule & {
    operator: DateOperators
}
