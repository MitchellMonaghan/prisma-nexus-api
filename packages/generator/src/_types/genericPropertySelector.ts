// Property Selectors
// sessionProp

// Operators
// column (ceq, cgte etc operators, price > quantity)

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

export type PropertySelector = {
    property: string
    operator: StringOperators | NumberOperators | BooleanOperators| DateOperators
}

// Logic Operators
export type AndOperator = {
    name: 'and'
    // eslint-disable-next-line no-use-before-define
    value: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}
export type OrOperator = {
    name: 'or'
    // eslint-disable-next-line no-use-before-define
    value: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}
export type NotOperator = {
    name: 'not'
    // eslint-disable-next-line no-use-before-define
    value: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

// Exists
export type ExistsOperator = {
    name: 'exists'
    table: string
    where: (AndOperator|OrOperator|NotOperator|PropertySelector)[]
}

export type NumberAccessRule = PropertySelector & {
    operator: NumberOperators
}

export type StringAccessRule = PropertySelector & {
    operator: StringOperators
}

export type BooleanAccessRule = PropertySelector & {
    operator: BooleanOperators
}

export type DateAccessRule = PropertySelector & {
    operator: DateOperators
}
