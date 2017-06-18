
// These values cannot come from web3
let account0 = '0x0000000000000000000000000000000000000000'
let account1 = '0x0000000000000000000000000000000000000000'

import { EventTypes } from '../../EventTypes/EventTypes'

export const addressValueEsEvent: EventTypes.IEsEvent = {
    Type: 'ADDRESS_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Address',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: account1,
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: ''
}

export const uIntValueEsEvent: EventTypes.IEsEvent = {
    Type: 'UINT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'UInt',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: ''
}

export const bytes32ValueEsEvent: EventTypes.IEsEvent = {
    Type: 'BYTES32_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Bytes32',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '0x6e6f74207265616c6c79206120627974657320333220737472696e6721000000',
    StringValue: ''
}
export const stringValueEsEvent: EventTypes.IEsEvent = {
    Type: 'STRING_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'String',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: 'COOL:STRING'
}

export const ipfsValueEsEvent: EventTypes.IEsEvent = {
    Type: 'IPFS:RECORD:CREATED',
    Version: 'v0',
    ValueType: 'String',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: 'ipfs/QmRa8NrWWxRa1TTenL8V3en9hbpQdPpjaURkz68wL7NfKU'
}

export const objectValueEsEvent: EventTypes.IEsEvent = {
    Type: 'OBJECT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Object',
    IsAuthorizedEvent: false,
    PermissionDomain: 'ES',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    StringValue: ''
}

export const numberCommand: EventTypes.ITransmuteCommand = {
    type: 'USERS_COUNTED',
    payload: 100
}

export const stringCommand: EventTypes.ITransmuteCommand = {
    type: 'TOPIC_SET',
    payload: 'ethereum'
}



export const ipfsObjectCommand: EventTypes.ITransmuteCommand = {
    type: 'IPFS:RECORD:CREATED',
    payload: {
        cool: 'story...bro'
    },
    meta: {
        handlers: ['ipfs']
    }
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
