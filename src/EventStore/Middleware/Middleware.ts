
const { keys, pick, omit, flatten, difference, extend } = require('lodash')
import { web3 } from '../../env'

import { EventTypes } from '../EventTypes/EventTypes'

import { Transactions } from '../Transactions/Transactions'

import * as _ from 'lodash'

import { isFSA } from 'flux-standard-action'

let DEBUG = true; //should be only for dev envs for performance reasons...

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


export module Middleware {

    export interface ITransmuteCommandResponse {
        events: Array<EventTypes.ITransmuteEvent>,
        transactions: Array<Transactions.ITransaction>
    }

    export const writeEsEvent = async (
        eventStore: any, 
        fromAddress: string,
        esEvent: EventTypes.IEsEvent
    ): Promise<Transactions.ITransaction> => {
        let {
            Type, 
            Version, 
            ValueType, 
            AddressValue, 
            UIntValue, 
            Bytes32Value, 
            PropertyCount
        } = esEvent
         return await eventStore.writeEvent( 
            Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, PropertyCount,
            {
                from: fromAddress,
                gas: 2000000
            })
    }

    export const writeEsEventProperty = async (
        eventStore: any, 
        fromAddress: string,
        esEventProp: EventTypes.IEsEventProperty
    ): Promise<Transactions.ITransaction> => {
        let {
            EventIndex,
            EventPropertyIndex,
            Name,
            ValueType,

            AddressValue,
            UIntValue,
            Bytes32Value
        } = esEventProp
         return await eventStore.writeEventProperty( 
            EventIndex, EventPropertyIndex, Name, ValueType, AddressValue, UIntValue, Bytes32Value,
            {
                from: fromAddress,
                gas: 2000000
            })
    }

    export const readEsEventValues = async (eventStore: any,  fromAddress: string, eventId: number)  => {
        // must be a .call constant modifier incompatible with _isAuthorized
        return await eventStore.readEvent.call(eventId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    export const readEsEventPropertyValues = async (eventStore: any,  fromAddress: string, eventId: number, propId: number)  => {
        // must be a .call constant modifier incompatible with _isAuthorized
        return await eventStore.readEventProperty.call(eventId, propId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    export const readTransmuteEvent = async (eventStore: any,  fromAddress: string, eventId: number): Promise<EventTypes.ITransmuteEvent>  => {
        let eventVals = await readEsEventValues(eventStore, fromAddress, eventId)
        let esEventWithTruffleTypes: EventTypes.IEsEventFromTruffle = EventTypes.getEsEventFromEsEventValues(eventVals)
        let esEvent: EventTypes.IEsEvent = EventTypes.getEsEventFromEsEventWithTruffleTypes('EsEvent', esEventWithTruffleTypes)
        let transmuteEvent = await EventTypes.esEventToTransmuteEvent(esEvent)
        if (DEBUG && !isFSA(transmuteEvent)){
            console.warn('WARNING: transmuteEvent: ', transmuteEvent, ' is not a FSA. see https://github.com/acdlite/flux-standard-action')
        }
        return transmuteEvent
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

    // can be extended later to handle validation... maybe...
    export const writeTransmuteCommand = async (eventStore: any,  fromAddress: string, transmuteCommand: EventTypes.ITransmuteCommand): Promise<ITransmuteCommandResponse>  => {
        // console.log('transmuteCommand: ', transmuteCommand)
        let esEvent = convertCommandToEsEvent(transmuteCommand)
        // console.log('esEvent: ', esEvent)
        let tx = await writeEsEvent(eventStore, fromAddress, esEvent)
        let eventsFromWriteEsEvent = await Transactions.eventsFromTransaction(tx)
        // console.log('eventsFromWriteEsEvent', eventsFromWriteEsEvent)
        let esEventWithIndex = eventsFromWriteEsEvent[0]
        let esEventProperties = convertCommandToEsEventProperties(esEventWithIndex, transmuteCommand)
        // console.log('esEventProperties: ', esEventProperties)

        let esEventPropertiesWithTxs = esEventProperties.map(async (esp) =>{
            return await writeEsEventProperty(eventStore, fromAddress, esp)
        })

        let txs = await Promise.all(esEventPropertiesWithTxs)
        let allTxs = _.flatten(txs.concat(tx))
        // console.log('allTxs: ', allTxs)

        let transmuteEvents = Transactions.reconstructTransmuteEventsFromTxs(allTxs)
       
        // // console.log('eventsFromWriteEsEvent', eventsFromWriteEsEvent)
        // let transmuteEvents = await eventsFromWriteEsEvent.map(async (evt) =>{
        //     return await esEventToTransmuteEvent(evt)
        // })
        // // console.log('transmuteEvents', transmuteEvents)
        // let awaitedEvents = await Promise.all(transmuteEvents)
        return <ITransmuteCommandResponse>{
            events: transmuteEvents,
            transactions: allTxs
        }
    }
    
   
    // const writeSolidityEventPropertyHelper = async (
    //     _esInstance,
    //     _callerMeta,
    //     _eventIndex,
    //     _eventPropertyIndex,
    //     _name,
    //     _type,
    //     _address,
    //     _uint,
    //     _string
    // ) => {
    //     return await _esInstance.writeSolidityEventProperty(
    //         _eventIndex,
    //         _eventPropertyIndex,
    //         _name,
    //         _type,
    //         _address,
    //         _uint,
    //         _string,
    //         _callerMeta
    //     )
    // }

    

    // const writePropsToEvent = async (_es, _callerMeta, _event, _eventProps) => {
    //     let propKeys = keys(_eventProps)
    //     let promises = []
    //     let propIndex = 0
    //     while (propIndex < propKeys.length) {
    //         let pp
    //         let wp = writeSolidityEventPropertyHelper
    //         let key = propKeys[propIndex]
    //         let value = _eventProps[key]
    //         let propType = EventTypes.guessType(value)
    //         switch (propType) {
    //             case 'String': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, 0, value); break
    //             case 'BigNumber': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, value, ''); break
    //             case 'Address': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, value, 0, ''); break
    //         }
    //         promises.push(pp)
    //         propIndex++
    //     }
    //     return promises
    // }

    // const hasRequiredProps = (eventObj) => {
    //     if (eventObj.Type === undefined){
    //         throw Error('Event requires Type property: ' + JSON.stringify(eventObj))
    //     }
    //     return true
    // }

    // // Needs work... This function parses the events we have extracted from tx logs (multiple txs)
    // // It then reconstructs the original event from the logs
    // // dangerous if other events are fireing in the tx, consider a string property on both event and prop event types
    // export const solidityEventReducer = (events) => {
    //     // console.log('rebuild the event here...', events)
    //     let _event = {}
    //     events.forEach((event) => {
    //         // NOT GOOD way of determing event type...
    //         if (event.Type && event.Created) {
    //             extend(_event, event)
    //         } else {
    //             switch (event.Type) {
    //                 case 'String': _event[event.Name] = event.StringValue; break
    //                 case 'BigNumber': _event[event.Name] = event.UIntValue; break
    //                 case 'Address': _event[event.Name] = event.AddressValue; break
    //             }
    //         }
    //     })
    //     return _event
    // }

    // /**
    // * @param {TruffleContract} esInstance - a contract instance which is an Event Store
    // * @param {Object} _callerMeta - from address and gas
    // * @param {Object} event - an event to be written to the EventStore
    // * @return {Promise<Object, Error>} a reconstructed event from the transaction logs
    // */
    // export const writeSolidityEventAsync = async (esInstance, _callerMeta, event) => {

    //     // TODO: Add check to make sure event does not contain reserved keys, throw error if so

    //     // danger hashing stringified objects may not be safe...
    //     event.PropertyCount = difference(keys(event), solidityEventProperties).length
    //     event.IntegrityHash = web3.sha3(JSON.stringify(event))

    //     hasRequiredProps(event)

    //     let _solEvent = objectToSolidityEvent(event)
    //     let _solEventProps = objectToSolidityEventProperties(event)
    //     let allEvents = []
    //     let wp = writeSolidityEventHelper
    //     return wp(esInstance, _callerMeta, _solEvent.Type, _solEvent.PropertyCount, _solEvent.IntegrityHash)
    //         .then((tx) => {
    //             let _events = Transactions.eventsFromTransaction(tx)
    //             let event = _events[0]
    //             allEvents.push(event)
    //             return event
    //         })
    //         .then((_event) => {
    //             return writePropsToEvent(esInstance, _callerMeta, _event, _solEventProps)
    //         })
    //         .then((txs) => {
    //             let dirtyEvents = txs.map((tx) => {
    //                 return Transactions.eventsFromTransaction(tx)
    //             })
    //             let propEvents = flatten(dirtyEvents)
    //             allEvents = allEvents.concat(propEvents)
    //             let reconstructedEvent = solidityEventReducer(allEvents)
    //             return reconstructedEvent
    //         })
    // }

    // /**
    // * @param {TruffleContract} esInstance - a contract instance which is an EventStore
    // * @param {Object} _callerMeta - from address and gas
    // * @param {Array} events - the events to be written to the EventStore
    // * @return {Promise<Array<Object>, Error>} an array of reconstructed events from the transaction logs
    // */
    // export const writeSolidityEventsAsync = async (esInstance, _callerMeta, _events) => {
    //     return Promise.all(_events.map(async (_event) => {
    //         return await writeSolidityEventAsync(esInstance, _callerMeta, _event)
    //     }))
    // }

    // const readSolidityEventHelper = async (esInstance, eventId) => {
    //     return {
    //         Id: eventId,
    //         Type: (await esInstance.readSolidityEventType.call(eventId)).toString(),
    //         Created: (await esInstance.readSolidityEventCreated.call(eventId)).toNumber(),
    //         IntegrityHash: (await esInstance.readSolidityEventIntegrityHash.call(eventId)).toString(),
    //         PropertyCount: (await esInstance.readSolidityEventPropertyCount.call(eventId)).toNumber()
    //     }
    // }

    // const readSolidityEventPropertyHelper = async (esInstance, eventId, propIndex) => {
    //     return {
    //         Id: eventId,
    //         EventPropertyIndex: propIndex,
    //         Name: (await esInstance.readSolidityEventPropertyName.call(eventId, propIndex)).toString(),
    //         Type: (await esInstance.readSolidityEventPropertyType.call(eventId, propIndex)).toString(),
    //         AddressValue: (await esInstance.readSolidityEventPropertyAddressValue.call(eventId, propIndex)).toString(),
    //         UIntValue: (await esInstance.readSolidityEventPropertyUIntValue.call(eventId, propIndex)).toNumber(),
    //         StringValue: (await esInstance.readSolidityEventPropertyStringValue.call(eventId, propIndex)).toString()
    //     }
    // }


    // /**
    // * @param {TruffleContract} esInstance - a contract instance which is an EventStore
    // * @param {Number} eventId - the solidityEventId to be read
    // * @return {Promise<Object, Error>} a solidity event from the EventStore
    // */
    // export const readSolidityEventAsync = async (esInstance, eventId) => {
    //     let event = await readSolidityEventHelper(esInstance, eventId)
    //     let propIndex = 0
    //     let props = []
    //     while (propIndex < event.PropertyCount) {
    //         let prop = await readSolidityEventPropertyHelper(esInstance, eventId, propIndex)
    //         props.push(prop)
    //         propIndex++
    //     }
    //     props.forEach((prop) => {
    //         let propObj = EventTypes.getTransmuteEventPropertyFromEsEventProperty(prop)
    //         event = Object.assign({}, event, propObj)
    //     })
    //     return event
    // }

    // /**
    // * @param {TruffleContract} esInstance - a contract instance which is an EventStore
    // * @param {Number} eventId - the starting index to read from the EventStore
    // * @return {Promise<Array<Object>, Error>} the solidity events from the EventStore
    // */
    // export const readSolidityEventsAsync = async (esInstance, eventId = 0) => {
    //     let currentEvent = await esInstance.solidityEventCount()
    //     let eventPromises = []
    //     while (eventId < currentEvent) {
    //         eventPromises.push(await readSolidityEventAsync(esInstance, eventId))
    //         eventId++
    //     }
    //     return await Promise.all(eventPromises)
    // }

}
