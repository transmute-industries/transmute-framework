
export const UNIVERSAL_EVENT = 'UNIVERSAL_EVENT'


//   struct SolidityEventProperty {
//     string Type;
//     address AddressValue;
//     uint UIntValue;
//     string StringValue;
//   }

//   struct SolidityEvent {
//     uint Id;
//     string Type;
//     uint Created;
//     uint PropertyCount;
//     mapping (uint => SolidityEventProperty) PropertyValues;
//   }

//   uint public solidityEventCount;
//   mapping (uint => SolidityEvent) solidityEvents;


/**
 * @typedef {Object} SolidityEventPropertySchema
 * @property {NEW_EVENT} a Solidity Event Schema
 */
export const SolidityEventPropertySchema = {
    Name: 'String',
    Type: 'String',

    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

/**
 * @typedef {Object} SolidityEventSchema
 * @property {NEW_EVENT} a Solidity Event Schema
 */
export const SolidityEventSchema = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',

    PropertyCount: 'String'
}

