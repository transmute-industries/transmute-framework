
// These values cannot come from web3
let account0 = '0x0000000000000000000000000000000000000000'
let account1 = '0x0000000000000000000000000000000000000000'

import { EventTypes } from '../../EventTypes/EventTypes'

export const addressValueEsEvent: EventTypes.IEsEvent = {
    Type: 'ADDRESS_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Address',
    AddressValue: account1,
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: '',
    PropertyCount: 0
}

export const uIntValueEsEvent: EventTypes.IEsEvent = {
    Type: 'UINT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'UInt',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: '',
    PropertyCount: 0
}

export const bytes32ValueEsEvent: EventTypes.IEsEvent = {
    Type: 'BYTES32_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Bytes32',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '0x6e6f74207265616c6c79206120627974657320333220737472696e6721000000',
    StringValue: '',
    PropertyCount: 0
}
export const stringValueEsEvent: EventTypes.IEsEvent = {
    Type: 'STRING_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'String',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: 'COOL:STRING',
    PropertyCount: 0
}

export const ipfsValueEsEvent: EventTypes.IEsEvent = {
    Type: 'IPFS:RECORD:CREATED',
    Version: 'v0',
    ValueType: 'String',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: 'QmRa8NrWWxRa1TTenL8V3en9hbpQdPpjaURkz68wL7NfKU',
    PropertyCount: 0
}

export const objectValueEsEvent: EventTypes.IEsEvent = {
    Type: 'OBJECT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Object',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: '',
    PropertyCount: 0
}

export const numberCommand: EventTypes.ITransmuteCommand = {
    type: 'USERS_COUNTED',
    payload: 100
}

export const stringCommand: EventTypes.ITransmuteCommand = {
    type: 'TOPIC_SET',
    payload: 'ethereum'
}

export const ipfsCommand: EventTypes.ITransmuteCommand = {
    type: 'IPFS:RECORD:CREATED',
    payload: 'QmRa8NrWWxRa1TTenL8V3en9hbpQdPpjaURkz68wL7NfKU'
}

export const addressCommand: EventTypes.ITransmuteCommand = {
    type: 'ADDRESS_SELECTED',
    payload: account1,
}

export const objectCommand: EventTypes.ITransmuteCommand = {
    type: 'USER_REGISTERED',
    payload: {
        address: account0,
        name: 'Vitalic',
        title: 'God Emperor',
        hobbies: ['knowing the answer to p v np', 'being fleek af'],
        skills: {
            python: 100,
            javascript: 70,
            typescript: 50
        }
    }
}


// NEEDING MORE TESTING FOR THESE

export const addressValueEsEventProperty: EventTypes.IEsEventProperty = {
    EventIndex: 0,              // should be overwritten
    EventPropertyIndex: 0,      // should be overwritten
    Name: 'SomeAddressKeyName', // should be overwritten
    ValueType: 'Address',

    AddressValue: '0x0000000000000000000000000000000000000000', // should be overwritten
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: ''

}

export const uIntValueEsEventProperty: EventTypes.IEsEventProperty = {
    EventIndex: 0,              // should be overwritten
    EventPropertyIndex: 0,      // should be overwritten
    Name: 'SomeUIntKeyName',    // should be overwritten
    ValueType: 'UInt',

    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0, // should be overwritten
    Bytes32Value: '',
    StringValue: ''
}

export const bytes32ValueEsEventProperty: EventTypes.IEsEventProperty = {
    EventIndex: 0,              // should be overwritten
    EventPropertyIndex: 0,      // should be overwritten
    Name: 'SomeBytes32KeyName', // should be overwritten
    ValueType: 'Bytes32',

    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '', // should be overwritten
    StringValue: ''
}

export const stringValueEsEventProperty: EventTypes.IEsEventProperty = {
    EventIndex: 0,              // should be overwritten
    EventPropertyIndex: 0,      // should be overwritten
    Name: 'SomeStringKeyName', // should be overwritten
    ValueType: 'String',

    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: ''  // should be overwritten
}



