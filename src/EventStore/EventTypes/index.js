
export const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
export const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'

export const SOLIDITY_EVENT_PROPERTY_SCHEMA = {
    EventIndex: 'BigNumber',
    EventPropertyIndex: 'BigNumber',
    Name: 'String',
    Type: 'String',

    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

export const SOLIDITY_EVENT_SCHEMA = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',
    IntegrityHash: 'String',
    PropertyCount: 'BigNumber'
}

export const SCHEMAS = {
    [SOLIDITY_EVENT]: SOLIDITY_EVENT_SCHEMA,
    [SOLIDITY_EVENT_PROPERTY]: SOLIDITY_EVENT_PROPERTY_SCHEMA
}
