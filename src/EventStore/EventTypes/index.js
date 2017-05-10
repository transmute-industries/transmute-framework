/**
* @typedef {String} SOLIDITY_EVENT
*/
export const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
/**
* @typedef {String} SOLIDITY_EVENT_PROPERTY
*/
export const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'

/**
* @typedef {Object} SolidityEventPropertySchema
* @property {Number} EventIndex  - the solidityEventId used by the EventStore
* @property {Number} EventPropertyIndex  - the property index used by the EventStore
* @property {String} Name - a string representing a key
* @property {String} Type - a string representing the type of the value
* @property {String} AddressValue - an address value
* @property {Number} UIntValue  - a uint value
* @property {String} StringValue - a string value
*/
export const SolidityEventPropertySchema = {
    EventIndex: 'BigNumber',
    EventPropertyIndex: 'BigNumber',
    Name: 'String',
    Type: 'String',

    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

/**
* @typedef {Object} SolidityEventSchema
* @property {Number} Id - the solidityEventId used by the EventStore
* @property {String} Type - a string representing the redux action
* @property {Number} Created - the time (uint) the event was written by the EventStore
* @property {String} IntegrityHash - web3.sha3(JSON.stringify(event)) an unsafe way to check if the object has changed
* @property {Number} PropertyCount - a number (uint) of custom properties on the event
*/
export const SolidityEventSchema = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',
    IntegrityHash: 'String',
    PropertyCount: 'BigNumber'
}

/**
* @typedef {Object} TruffleEventSchema
* @property {SolidityEventSchema} SOLIDITY_EVENT -  a Solidity Event Schema
* @property {SolidityEventPropertySchema} SOLIDITY_EVENT_PROPERTY - a Solidity Event Property Schema
*/
export const TruffleEventSchema = {
    [SOLIDITY_EVENT]: SolidityEventSchema,
    [SOLIDITY_EVENT_PROPERTY]: SolidityEventPropertySchema
}
