
export const NEW_EVENT = 'NEW_EVENT'


/**
 * @typedef {Object} EVENT_SCHEMAS
 * @property {NEW_EVENT} a Solidity Event Schema
 */
export const EVENT_SCHEMAS = {
    [NEW_EVENT]: {
        Id: 'BigNumber',
        Type: 'String',
        Created: 'BigNumber',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        StringValue: 'String'
    }
}

