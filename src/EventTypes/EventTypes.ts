
import { web3 } from '../env'

import * as _ from 'lodash'

export module EventTypes {

    export interface ISolidityEventSchema {
        Id: Object;
        Type: string;
        Version: string;

        ValueType: string;
        AddressValue: string;
        UIntValue: Object;
        Bytes32Value: string;

        TxOrigin: string;
        Created: Object;
        PropertyCount: Object;
    }

    export interface ISolidityEventPropertySchema {
        EventIndex: Object;
        EventPropertyIndex: Object;
        Name: string;
        Type: string;

        AddressValue: string;
        UIntValue: Object;
        Bytes32Value: string;
    }

    export const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }

    /**
    * @typedef {String} SOLIDITY_EVENT
    */
    export const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
    /**
    * @typedef {String} SOLIDITY_EVENT_PROPERTY
    */
    export const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'

    /**
    * @typedef {Object} SolidityEventPropertySchema
    * @property {Number} EventIndex  - the solidityEventId used by the EventStore
    * @property {Number} EventPropertyIndex  - the property index used by the EventStore
    * @property {String} Name - a string representing a key
    * @property {String} Type - a string representing the type of the value
    * @property {String} AddressValue - an address value
    * @property {Number} UIntValue  - a uint value
    * @property {String} Bytes32Value - a string value
    */
    export const SolidityEventPropertySchema = {
        EventIndex: 'BigNumber',
        EventPropertyIndex: 'BigNumber',
        Name: 'Bytes32',
        Type: 'Bytes32',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32'
    }

    /**
    * @typedef {Object} SolidityEventSchema
    * @property {Number} Id - the solidityEventId used by the EventStore
    * @property {String} Type - a string representing the redux action
    * @property {Number} Created - the time (uint) the event was written by the EventStore
    * @property {String} IntegrityHash - web3.sha3(JSON.stringify(event)) an unsafe way to check if the object has changed
    * @property {Number} PropertyCount - a number (uint) of custom properties on the event
    */
    export const SolidityEventSchema = {
        Id: 'BigNumber',
        Type: 'Bytes32',
        Version: 'Bytes32',

        ValueType: 'Bytes32',
        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32',

        TxOrigin: 'String',
        Created: 'BigNumber',
        PropertyCount: 'BigNumber'
    }

    // The event with all its types fixed...
    export const TransmuteEvent = {

    }

    /**
    * @typedef {Object} TruffleEventSchema
    * @property {SolidityEventSchema} SOLIDITY_EVENT -  a Solidity Event Schema
    * @property {SolidityEventPropertySchema} SOLIDITY_EVENT_PROPERTY - a Solidity Event Property Schema
    */
    export const TruffleEventSchema = {
        [SOLIDITY_EVENT]: SolidityEventSchema,
        [SOLIDITY_EVENT_PROPERTY]: SolidityEventPropertySchema
    }

     /**
     * @type {Function} getPropFromSchema - convert truffle values by type
     * @param {String} propType - the type of the truffle property
     * @param {Object} readModel - a json object representing the state of a given model
     * @return {Object} the property type without truffle data types (no bid numbers or other truffle types...)
     */
    export const getPropFromSchema = (propType, value) => {
        switch (propType) {
            case 'Address': return value.toString()
            case 'String': return value.toString()
            case 'Bytes32': return EventTypes.toAscii(value)
            case 'BigNumber': return value.toNumber()
            case 'UInt': return value.toNumber()
            default: throw Error(`UNKNWON propType for value '${value}'. Make sure your schema is up to date.`)
        }
    }

    export const solidityEventPropertyToObject = (prop) => {
        let _obj = {}
        switch (prop.Type) {
            case 'Bytes32': _obj[prop.Name] = toAscii(prop.Bytes32Value); break;
            case 'BigNumber': _obj[prop.Name] = prop.UIntValue; break;
            case 'Address': _obj[prop.Name] = prop.AddressValue; break;
        }
        return _obj
    }

    export const eventValuesTo_SOLIDITY_EVENT = (eventValues) => {
        let evt = {};
        _.keys(SolidityEventSchema).map((k, i ) =>{
            evt[k] = eventValues[i]
        })
        return evt
    }

    export const SOLIDITY_EVENT_to_payload = (eventType, solEvent) =>{
        let event = {}
        let schema = TruffleEventSchema[eventType]
        _.forIn(solEvent, (value, key) => {
            let prop = getPropFromSchema(schema[key], value)
            _.extend(event, {
                [key]: prop
            })
        })
        return event
    }
}