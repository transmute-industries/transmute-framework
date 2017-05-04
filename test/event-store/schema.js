const { NEW_EVENT } = require('./constants')

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

module.exports = {
  EVENT_SCHEMAS
}
