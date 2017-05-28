import { web3 } from '../../../env'

import {EventTypes} from '../../EventTypes/EventTypes'

export const esEvent: EventTypes.IEsEvent = {
    Type: 'ADDRESS_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Address',
    AddressValue: web3.eth.accounts[1],
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 0
}

export const esEventWithProp: EventTypes.IEsEvent = {
    Type: 'OBJECT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Object',
    AddressValue: '',
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 1
}

export const esEventProp: EventTypes.IEsEventProperty = {
    EventIndex: 0,
    EventPropertyIndex: 0,
    Name: 'CustomKey',
    ValueType: 'Bytes32',

    AddressValue: '',
    UIntValue: 0,
    Bytes32Value: 'CustomValue'
}

