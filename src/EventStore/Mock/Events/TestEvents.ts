import { web3 } from '../../../env'

import {EventTypes} from '../../EventTypes/EventTypes'

export const testAddressValueEvent: EventTypes.ITransmuteEvent = {
    Type: 'ADDRESS_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Address',
    AddressValue: web3.eth.accounts[1],
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 0
}

export const testObjectEvent: EventTypes.ITransmuteEvent = {
    Type: 'OBJECT_EVENT_TESTED',
    Version: 'v0',
    ValueType: 'Object',
    AddressValue: '',
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 1
}


// EventIndex: number;
// EventPropertyIndex: number;
// Name: string;
// Type: string;

// AddressValue: string;
// UIntValue: number;
// Bytes32Value: string;

export const testObjectEventProperty: EventTypes.ITransmuteEventProperty = {
    EventIndex: 0,
    EventPropertyIndex: 0,
    Name: 'CustomKey',
    ValueType: 'Bytes32',

    AddressValue: '',
    UIntValue: 0,
    Bytes32Value: 'CustomValue'
}

