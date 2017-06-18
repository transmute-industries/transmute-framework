var ethUtils = require('ethereumjs-util')

const camelcaseKeys = require('camelcase-keys')

import * as _ from 'lodash'

// code smell these should be defaults??? but I kinda like not having mocks and defaults all over the place...
// dry is more important imo...
import {
    addressValueEsEvent,
    uIntValueEsEvent,
    bytes32ValueEsEvent,
    stringValueEsEvent,
    objectValueEsEvent
} from '../Mock/Events/TestEvents'


export module EventTypes {

    export interface IBigNumber {
        toNumber: () => number;
    }

    export interface IEsEventFromTruffle {
        Id: IBigNumber;
        Type: string;
        Version: string;

        ValueType: string;
        IsAuthorizedEvent: boolean;
        PermissionDomain: string;

        AddressValue: string;
        UIntValue: IBigNumber;
        Bytes32Value: string;

        TxOrigin: string;
        Created: IBigNumber;
    }

    export interface IEsEvent {
        Id?: number;
        Type: string;
        Version: string;

        ValueType: string;
        IsAuthorizedEvent: boolean;
        PermissionDomain: string;

        AddressValue: string;
        UIntValue: number;
        Bytes32Value: string;
        StringValue: string;

        TxOrigin?: string;
        Created?: number;
    }

    export interface ITransmuteEventMeta {
        id: number;
        version: string;
        txOrigin: string;
        created: number;
        path?: string;
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
        meta: ITransmuteEventMeta
        // meta data from the event, this keeps the payload clean of meta data, which is important!
    }

    export interface ITransmuteCommandMeta {
        handlers: Array<string>
    }
    export interface ITransmuteCommand {
        type: string,
        payload: any,
        meta?: ITransmuteCommandMeta
    }

    export interface ITransaction {
        tx: string;
        receipt: any;
        logs: any[]
    }

    export interface ITransmuteCommandResponse {
        events: Array<ITransmuteEvent>,
        transactions: Array<ITransaction>
    }

    export interface IReadModel {
        lastEvent: number;
        readModelType: string;
        readModelStoreKey: string;
        contractAddress: string;
        model: any;
    }

    export const toAscii = (value) => {
        return ethUtils.toAscii(value).replace(/\u0000/g, '')
    }

    export const guessType = (value) => {
        if (typeof value === 'number') {
            return 'UInt'
        }
        if (typeof value === 'object') {
            return 'Object'
        }
        if (typeof value === 'string') {
            if (ethUtils.isValidAddress(value)) {
                return 'Address'
            }
            return 'String'
        }
        throw Error('unable to guess type of value: ' + value)
    }

    /**
    * @typedef {String} EsEvent
    */
    export const EsEvent = 'EsEvent'

    /**
    * @typedef {Object} EsEventSchema
    * @property {Number} Id - the solidityEventId used by the EventStore
    * @property {String} Type - a string representing the redux action
    * @property {String} Version - the current version of the EventStore
    * @property {String} ValueType - the type of value stored in the event
    * @property {Boolean} IsAuthorizedEvent - flag determining whether or not the sender needs to be authorized under a domain to read / write this event
    * @property {String} PermissionDomain - domain under which an event is scoped
    * @property {String} AddressValue - address value of event
    * @property {Number} UIntValue - uint value of event
    * @property {String} Bytes32Value - bytes32 value of event
    * @property {String} StringValue - string value of event
    * @property {String} TxOrigin - the original message sender for this event
    * @property {Number} Created - the time (uint) the event was written by the EventStore
    */
    export const EsEventSchema = {
        Id: 'BigNumber',
        Type: 'Bytes32',
        Version: 'Bytes32',

        ValueType: 'Bytes32',
        IsAuthorizedEvent: 'Boolean',
        PermissionDomain: 'Bytes32',

        AddressValue: 'String',
        UIntValue: 'BigNumber',
        Bytes32Value: 'Bytes32',
        StringValue: 'String',

        TxOrigin: 'String',
        Created: 'BigNumber'
    }

    /**
    * @typedef {Object} TruffleEventSchema
    * @property {EsEventSchema} EsEvent -  a Solidity Event Schema
    */
    export const TruffleEventSchema = {
        [EsEvent]: EsEventSchema
    }

    /**
    * @type {Function} getPropFromTruffleEventSchemaType - convert truffle values to transmute values (js types) from schema keys
    * @param {String} schemaPropType - the type of the truffle property
    * @param {Object} readModel - a json object representing the state of a given model
    * @return {Object} the property type without truffle data types (no bid numbers or other truffle types...)
    */
    export const getPropFromTruffleEventSchemaType = (schemaPropType, truffleValue) => {
        switch (schemaPropType) {
            case 'String': return truffleValue.toString()
            case 'Address': return truffleValue.toString()
            case 'String': return truffleValue.toString()
            case 'Bytes32': return EventTypes.toAscii(truffleValue)
            case 'BigNumber': return truffleValue.toNumber()
            case 'UInt': return truffleValue.toNumber()
            case 'Boolean': return truffleValue
            default: throw Error(`UNKNOWN schemaPropType for truffleValue '${truffleValue}'. Make sure your schema is up to date.`)
        }
    }

    export const getEsEventFromEsEventValues = (eventValues): IEsEventFromTruffle => {
        let evt = {};
        _.keys(EsEventSchema).map((k, i) => {
            evt[k] = eventValues[i]
        })
        return <IEsEventFromTruffle>evt
    }

    // these 2 should be more DRY
    export const getEsEventFromEsEventWithTruffleTypes = (eventType: string, solEvent: IEsEventFromTruffle): IEsEvent => {
        let event = {}
        let schema = TruffleEventSchema[eventType]
        _.forIn(solEvent, (value, key) => {
            let prop = getPropFromTruffleEventSchemaType(schema[key], value)
            _.extend(event, {
                [key]: prop
            })
        })
        return <IEsEvent>event
    }

    export const getValueType = (es: any) => {
        switch (es.ValueType) {
            case 'Address': return es.AddressValue
            case 'String': return es.StringValue
            case 'UInt': return es.UIntValue
            case 'Bytes32': return es.Bytes32Value
            default: throw Error('ValueType invalid, must be [UInt, Address, Bytes32, String]')
        }
    }

    export const convertMeta = (esEvent: EventTypes.IEsEvent): any => {
        let metaKeys = ['Type', 'ValueType', 'IsAuthorizedEvent', 'PermissionDomain', 'AddressValue', 'UIntValue', 'Bytes32Value', 'StringValue']
        let objectWithoutEsMeta = _.omit(esEvent, metaKeys);
        let withProperCase = camelcaseKeys(objectWithoutEsMeta);
        return withProperCase
    }

    export const esEventToTransmuteEvent = async (
        esEvent: EventTypes.IEsEvent
    ): Promise<EventTypes.ITransmuteEvent> => {
        // console.log('esEvent to be transmuted: ', esEvent)
        let payload: any = {}
        let meta: ITransmuteEventMeta = convertMeta(esEvent)
        payload = getValueType(esEvent)
        return <EventTypes.ITransmuteEvent>{
            type: esEvent.Type,
            payload: payload,
            meta: meta
        }
    }

    export const convertCommandToEsEvent = (transmuteCommand: EventTypes.ITransmuteCommand): EventTypes.IEsEvent => {
        let valueType = EventTypes.guessType(transmuteCommand.payload)
        let esEvent
        // console.log('valueType: ', valueType)
        switch (valueType) {
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
            case 'String':
                esEvent = _.cloneDeep(stringValueEsEvent);
                esEvent.StringValue = transmuteCommand.payload
                break
            case 'Boolean':
                esEvent = _.cloneDeep(stringValueEsEvent);
                esEvent.StringValue = transmuteCommand.payload
                break
            default:
                throw Error('Unkown valueType: ' + valueType)
        }
        esEvent.Type = transmuteCommand.type
        return <EventTypes.IEsEvent>esEvent
    }

    // http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
    export const flatten = (data) => {
        var result = {};
        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                if (l == 0)
                    result[prop] = [];
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
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

    /**
     * @type {Function} eventsFromTransaction - extract an array of events from a truffle transaction
     * @param {Object} tx - an ethereum log from a transaction
     * @return {Object} an array of all NEW_EVENTS in the transaction tx
     */
    export const eventsFromTransaction = (tx) => {
        let allEvents = tx.logs.map((log) => {
            return EventTypes.getEsEventFromEsEventWithTruffleTypes(log.event, log.args)
        })
        return allEvents
    }

    export const reconstructTransmuteEventsFromTxs = (txs: Array<EventTypes.ITransaction>) => {
        let esEventsAndEventProps = _.flatten(txs.map(eventsFromTransaction))
        // console.log('esEventsAndEventProps: ', esEventsAndEventProps)
        let esEvents = _.filter(esEventsAndEventProps, (obj) => {
            return obj.Id !== undefined
        })
        // console.log('esEvents: ', esEvents)
        let transmuteEvents = []
        esEvents.forEach((esEvent) => {
            let transmuteEvent = EventTypes.esEventToTransmuteEvent(esEvent)
            transmuteEvents.push(transmuteEvent)
        })
        return transmuteEvents
    }

}
