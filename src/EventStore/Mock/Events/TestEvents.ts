import { web3 } from '../../../env'

import {EventTypes} from '../../EventTypes/EventTypes'

export const addressValueEsEvent: EventTypes.IEsEvent = {
    Type: 'ADDRESS_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Address',
    AddressValue: web3.eth.accounts[1],
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 0
}

export const bytes32ValueEsEvent: EventTypes.IEsEvent = {
    Type: 'BYTES32_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Bytes32',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '0x6e6f74207265616c6c79206120627974657320333220737472696e6721000000',
    PropertyCount: 0
}

export const uIntValueEsEvent: EventTypes.IEsEvent = {
    Type: 'UINT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'UInt',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
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

export const addressCommand: EventTypes.ITransmuteCommand = {
    type: 'ADDRESS_SELECTED',
    payload: web3.eth.accounts[1],
}

// NEEDING MORE TESTING FOR THESE
export const esEventWithProp: EventTypes.IEsEvent = {
    Type: 'OBJECT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Object',
    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 1
}

export const esEventProp: EventTypes.IEsEventProperty = {
    EventIndex: 0,
    EventPropertyIndex: 0,
    Name: 'CustomKey',
    ValueType: 'Bytes32',

    AddressValue: '0x0000000000000000000000000000000000000000',
    UIntValue: 0,
    Bytes32Value: 'CustomValue'
}

