
const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'


const SolidityEventPropertySchema = {
    EventIndex: 'BigNumber',
    EventPropertyIndex: 'BigNumber',
    Name: 'String',
    Type: 'String',

    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

const SolidityEventSchema = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',
    IntegrityHash: 'String',
    PropertyCount: 'BigNumber'
}

const TruffleEventSchema = {
    [SOLIDITY_EVENT]: SolidityEventSchema,
    [SOLIDITY_EVENT_PROPERTY]: SolidityEventPropertySchema,
}

const solidityEventPropertyToObject = (prop) => {
    let _obj = {}
    switch (prop.Type) {
        case 'String': _obj[prop.Name] = prop.StringValue; break;
        case 'BigNumber': _obj[prop.Name] = prop.UIntValue; break;
        case 'Address': _obj[prop.Name] = prop.AddressValue; break;
    }
    return _obj
}

module.exports = {
    TruffleEventSchema,
    SOLIDITY_EVENT,
    SOLIDITY_EVENT_PROPERTY,
    SolidityEventSchema,
    SolidityEventPropertySchema,
    solidityEventPropertyToObject
}