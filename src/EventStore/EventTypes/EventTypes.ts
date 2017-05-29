
import { web3 } from '../../env'

import * as _ from 'lodash'

const camelcaseKeys = require('camelcase-keys')


// code smell these should be defaults??? but I kinda like not having mocks and defaults all over the place...
// dry is more important imo...
import { 
    addressValueEsEvent, 
    uIntValueEsEvent,
    bytes32ValueEsEvent,
    objectValueEsEvent,

    addressValueEsEventProperty,
    uIntValueEsEventProperty,
    bytes32ValueEsEventProperty
} from '../Mock/Events/TestEvents'


export module EventTypes {

    export interface IBigNumber {
        toNumber: ()=> number;
    }

    export interface IEsEventFromTruffle {
        Id: IBigNumber;
        Type: string;
        Version: string;

        ValueType: string;
        AddressValue: string;
        UIntValue: IBigNumber;
        Bytes32Value: string;

        TxOrigin: string;
        Created: IBigNumber;
        PropertyCount: IBigNumber;
    }

    export interface IEsEventPropertyFromTruffle {
        EventIndex: IBigNumber;
        EventPropertyIndex: IBigNumber;
        Name: string;
        ValueType: string;

        AddressValue: string;
        UIntValue: IBigNumber;
        Bytes32Value: string;
    }

    export interface IEsEvent {
        Id?: number;
        Type: string;
        Version: string;

        ValueType: string;
        AddressValue: string;
        UIntValue: number;
        Bytes32Value: string;

        TxOrigin?: string;
        Created?: number;
        PropertyCount?: number;
    }

    export interface IEsEventProperty {
        EventIndex: number;
        EventPropertyIndex: number;
        Name: string;
        ValueType: string;

        AddressValue: string;
        UIntValue: number;
        Bytes32Value: string;
    }

    export interface ITransmuteEventMeta{
        id: number,
        version: string,
        txOrigin: string
        created: number
    }

    // an event that is compatible with redux actions
    // http://redux.js.org/docs/basics/Actions.html
    // https://github.com/airbnb/javascript#objects
    // https://github.com/acdlite/flux-standard-action
    // TLDR; we are extending the FSA here, to add some required EventStore properties to meta, making it required
    export interface ITransmuteEvent {
        type: string,
        // The type of an action identifies to the consumer the nature of the action that has occurred. 
        // By convention, type is usually a string constant or a Symbol. 
        // If two types are the same, they MUST be strictly equivalent (using ===).
        payload: any,
        // The optional payload property MAY be any type of value. It represents the payload of the action. 
        // Any information about the action that is not the type or status of the action should be part of the payload field.
        // By convention, if error is true, the payload SHOULD be an error object. This is akin to rejecting a promise with an error object.
        error?: any,
        // The optional error property MAY be set to true if the action represents an error.
        // An action whose error is true is analogous to a rejected Promise. By convention, the payload SHOULD be an error object.
        // If error has any other value besides true, including undefined and null, the action MUST NOT be interpreted as an error.
        meta:ITransmuteEventMeta
        // meta data from the event, this keeps the payload clean of meta data, which is important!
    }

    export interface ITransmuteCommand {
        type: string,
        payload: any
    }

    export const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }

    export const guessType = (value) => {
        if (typeof value === 'number') {
            return 'UInt'
        }
        if (typeof value === 'object') {
            return 'Object'
        }
        if (typeof value === 'string') {
            if (web3.isAddress(value)) {
                return 'Address'
            }
            return 'Bytes32'
        }
        throw Error('unable to guess type of value: ' + value)
    }

    /**
    * @typedef {String} EsEvent
    */
    export const EsEvent = 'EsEvent'
    /**
    * @typedef {String} EsEventProperty
    */
    export const EsEventProperty = 'EsEventProperty'

    /**
    * @typedef {Object} EsEventPropertySchema
    * @property {Number} EventIndex  - the solidityEventId used by the EventStore
    * @property {Number} EventPropertyIndex  - the property index used by the EventStore
    * @property {String} Name - a string representing a key
    * @property {String} Type - a string representing the type of the value
    * @property {String} AddressValue - an address value
    * @property {Number} UIntValue  - a uint value
    * @property {String} Bytes32Value - a string value
    */
    export const EsEventPropertySchema = {
        EventIndex: 'BigNumber',
        EventPropertyIndex: 'BigNumber',
        Name: 'Bytes32',
        ValueType: 'Bytes32',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32'
    }

    /**
    * @typedef {Object} EsEventSchema
    * @property {Number} Id - the solidityEventId used by the EventStore
    * @property {String} Type - a string representing the redux action
    * @property {Number} Created - the time (uint) the event was written by the EventStore
    * @property {String} IntegrityHash - web3.sha3(JSON.stringify(event)) an unsafe way to check if the object has changed
    * @property {Number} PropertyCount - a number (uint) of custom properties on the event
    */
    export const EsEventSchema = {
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

    /**
    * @typedef {Object} TruffleEventSchema
    * @property {EsEventSchema} EsEvent -  a Solidity Event Schema
    * @property {EsEventPropertySchema} EsEventProperty - a Solidity Event Property Schema
    */
    export const TruffleEventSchema = {
        [EsEvent]: EsEventSchema,
        [EsEventProperty]: EsEventPropertySchema
    }

     /**
     * @type {Function} getPropFromTruffleEventSchemaType - convert truffle values to transmute values (js types) from schema keys
     * @param {String} schemaPropType - the type of the truffle property
     * @param {Object} readModel - a json object representing the state of a given model
     * @return {Object} the property type without truffle data types (no bid numbers or other truffle types...)
     */
    export const getPropFromTruffleEventSchemaType = (schemaPropType, truffleValue) => {
        switch (schemaPropType) {
            case 'Address': return truffleValue.toString()
            case 'String': return truffleValue.toString()
            case 'Bytes32': return EventTypes.toAscii(truffleValue)
            case 'BigNumber': return truffleValue.toNumber()
            case 'UInt': return truffleValue.toNumber()
            default: throw Error(`UNKNWON schemaPropType for truffleValue '${truffleValue}'. Make sure your schema is up to date.`)
        }
    }

    export const getTransmuteEventPropertyFromEsEventProperty = (prop) => {
        let _obj = {}
        switch (prop.ValueType) {
            case 'Bytes32': _obj[prop.Name] = toAscii(prop.Bytes32Value); break;
            case 'BigNumber': _obj[prop.Name] = prop.UIntValue; break;
            case 'Address': _obj[prop.Name] = prop.AddressValue; break;
        }
        return _obj
    }

    export const getEsEventFromEsEventValues = (eventValues): IEsEventFromTruffle  => {
        let evt = {};
        _.keys(EsEventSchema).map((k, i ) =>{
            evt[k] = eventValues[i]
        })
        return <IEsEventFromTruffle> evt
    }

    export const getEsEventPropertyFromEsEventPropertyValues = (eventPropValues): IEsEventPropertyFromTruffle  => {
        let evt = {};
        _.keys(EsEventPropertySchema).map((k, i ) =>{
            evt[k] = eventPropValues[i]
        })
        return <IEsEventPropertyFromTruffle> evt
    }

    export const getEsEventFromEsEventWithTruffleTypes = (eventType: string, solEvent: IEsEventFromTruffle): IEsEvent  =>{      
        let event = {}
        let schema = TruffleEventSchema[eventType]
        _.forIn(solEvent, (value, key) => {
            let prop = getPropFromTruffleEventSchemaType(schema[key], value)
            _.extend(event, {
                [key]: prop
            })
        })
        return <IEsEvent> event
    }

    export const getValueType = (es: any) => {
        switch(es.ValueType) {
            case 'Address': return es.AddressValue
            case 'UInt': return es.UIntValue
            case 'Bytes32': return es.Bytes32Value
            default: throw Error('ValueType invalid, must be [UInt, Address, Bytes32]')
        }
    }

    export const convertMeta = (esEvent: EventTypes.IEsEvent): any =>{
        let metaKeys = ['Type', 'ValueType', 'PropertyCount', 'AddressValue', 'UIntValue', 'Bytes32Value']
        let objectWithoutEsMeta = _.omit(esEvent, metaKeys);
        let withProperCase =  camelcaseKeys(objectWithoutEsMeta);
        return withProperCase
    }

     export const payloadReducer = (state: any = {}, esEvenProperty: EventTypes.IEsEventProperty) => {
        return Object.assign({}, state, {
            [esEvenProperty.Name]: getValueType(esEvenProperty)
        })
    }

    export const esEventToTransmuteEvent = async (
        esEvent: EventTypes.IEsEvent, 
        esEventProps?: Array<EventTypes.IEsEventProperty>
    ): Promise<EventTypes.ITransmuteEvent> =>{
        // console.log('esEvent to be transmuted: ', esEvent)
        let payload: any = {}
        let meta: ITransmuteEventMeta = convertMeta(esEvent)
        if (!esEvent.PropertyCount){
            payload = getValueType(esEvent)
        } else {
            esEventProps.forEach((esEventProp) =>{
                payload = payloadReducer(payload, esEventProp)
            })
            payload = EventTypes.unflatten(payload)
        }
        return <EventTypes.ITransmuteEvent>{
            type: esEvent.Type,
            payload: payload,
            meta: meta
        }
    }

    export const convertCommandToEsEvent = (transmuteCommand: EventTypes.ITransmuteCommand): EventTypes.IEsEvent =>{
        let valueType = EventTypes.guessType(transmuteCommand.payload)
        let esEvent
        // console.log('valueType: ', valueType)
        switch(valueType){
            case 'Address': 
                esEvent = _.cloneDeep(addressValueEsEvent); 
                esEvent.AddressValue = transmuteCommand.payload
                break
            case 'UInt': 
                esEvent = _.cloneDeep(uIntValueEsEvent); 
                esEvent.UIntValue = transmuteCommand.payload
                break
            case 'Bytes32': 
                esEvent = _.cloneDeep(bytes32ValueEsEvent); 
                esEvent.Bytes32Value = transmuteCommand.payload
                break
            case 'Object': 
                esEvent = _.cloneDeep(objectValueEsEvent); 
                esEvent.PropertyCount = Object.keys(transmuteCommand.payload).length
                break
            default:
                throw Error('Unkown valueType: ' + valueType)
        }
        esEvent.Type = transmuteCommand.type
        return <EventTypes.IEsEvent> esEvent
    }

      export const convertCommandToEsEventProperties = (
        esEvent: EventTypes.IEsEvent, 
        transmuteCommand: EventTypes.ITransmuteCommand
    ): Array<EventTypes.IEsEventProperty> =>{
        let payload = transmuteCommand.payload
        let flatPayload = EventTypes.flatten(payload)
        // console.log('flatPayload: ', flatPayload )
        let payloadKeys = _.keys(flatPayload)
        let payloadVals = _.values(flatPayload)
        let payLoadValueTypes = payloadVals.map(EventTypes.guessType)
        // console.log('payloadKeys: ', payloadKeys )
        // console.log('payloadVals: ', payloadVals )
        // console.log('payLoadValueTypes: ', payLoadValueTypes )
        let esEventProps = []
        payloadKeys.forEach((key, i) =>{
            // console.log(i)
            let esEventProp
            let valueType = payLoadValueTypes[i]
            let value = payloadVals[i]
            let name = payloadKeys[i]
            switch(valueType){
                case 'Address': 
                    esEventProp = _.cloneDeep(addressValueEsEventProperty); 
                    esEventProp.AddressValue = value
                    break
                case 'UInt': 
                    esEventProp = _.cloneDeep(uIntValueEsEventProperty); 
                    esEventProp.UIntValue = value
                    break
                case 'Bytes32': 
                    esEventProp = _.cloneDeep(bytes32ValueEsEventProperty); 
                    esEventProp.Bytes32Value = value
                    break
                default:
                    throw Error('Unkown valueType: ' + valueType)
            }
            esEventProp.EventIndex = esEvent.Id
            esEventProp.EventPropertyIndex = i
            esEventProp.Name = name
            esEventProps.push(esEventProp)
        })
        return <any> esEventProps
    }
    

    // http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
    export const flatten = (data) => {
        var result = {};
        function recurse (cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for(var i=0, l=cur.length; i<l; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                if (l == 0)
                    result[prop] = [];
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop+"."+p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(data, "");
        return result;
    }

    export const unflatten = (data: Object): Object => {
        if (Object(data) !== data || Array.isArray(data))
            return data;
        var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
            resultholder = {};
        for (var p in data) {
            var cur = resultholder,
                prop = "",
                m;
            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }
        return resultholder[""] || resultholder;
    }

}