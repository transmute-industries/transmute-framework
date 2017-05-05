
const NEW_EVENT = 'NEW_EVENT'

const EVENT_SCHEMAS = {
    [NEW_EVENT]: {
        Id: 'BigNumber',
        Type: 'String',
        Created: 'BigNumber',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        StringValue: 'String'
    }
}


export default {
    NEW_EVENT,
    EVENT_SCHEMAS
}
