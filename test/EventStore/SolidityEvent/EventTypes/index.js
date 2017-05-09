
const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'


const SOLIDITY_EVENT_PROPERTY_SCHEMA = {
    EventIndex: 'BigNumber',
    EventPropertyIndex: 'BigNumber',
    Name: 'String',
    Type: 'String',

    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

const SOLIDITY_EVENT_SCHEMA = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',
    IntegrityHash: 'String',
    PropertyCount: 'BigNumber'
}

const SCHEMAS = {
    [SOLIDITY_EVENT]: SOLIDITY_EVENT_SCHEMA,
    [SOLIDITY_EVENT_PROPERTY]: SOLIDITY_EVENT_PROPERTY_SCHEMA,
}

module.exports = {
    SCHEMAS,
    SOLIDITY_EVENT,
    SOLIDITY_EVENT_PROPERTY,
    SOLIDITY_EVENT_SCHEMA,
    SOLIDITY_EVENT_PROPERTY_SCHEMA
}