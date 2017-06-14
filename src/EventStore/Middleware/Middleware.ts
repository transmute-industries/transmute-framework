
const { keys, pick, omit, flatten, difference, extend } = require('lodash')

import { EventTypes } from '../EventTypes/EventTypes'

import * as _ from 'lodash'

import { isFSA } from 'flux-standard-action'

let DEBUG = true; //should be only for dev envs for performance reasons...

import TransmuteFramework from '../../TransmuteFramework'

export module Middleware {

    export const writeEsEvent = async (
        eventStore: any,
        fromAddress: string,
        esEvent: EventTypes.IEsEvent
    ): Promise<EventTypes.ITransaction> => {
        let {
            Type,
            Version,
            ValueType,
            AddressValue,
            UIntValue,
            Bytes32Value,
            StringValue,
            PropertyCount
        } = esEvent
        return await eventStore.writeEvent(
            Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, StringValue, PropertyCount,
            {
                from: fromAddress,
                gas: 2000000
            })
    }

    export const writeEsEventProperty = async (
        eventStore: any,
        fromAddress: string,
        esEventProp: EventTypes.IEsEventProperty
    ): Promise<EventTypes.ITransaction> => {
        let {
            EventIndex,
            EventPropertyIndex,
            Name,
            ValueType,

            AddressValue,
            UIntValue,
            Bytes32Value,
            StringValue
        } = esEventProp
        return await eventStore.writeEventProperty(
            EventIndex, EventPropertyIndex, Name, ValueType, AddressValue, UIntValue, Bytes32Value, StringValue,
            {
                from: fromAddress,
                gas: 2000000
            })
    }

    export const readEsEventValues = async (eventStore: any, fromAddress: string, eventId: number) => {
        // must be a .call constant modifier incompatible with _isAuthorized
        return await eventStore.readEvent.call(eventId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    export const readEsEventPropertyValues = async (eventStore: any, fromAddress: string, eventId: number, propId: number) => {
        // must be a .call constant modifier incompatible with _isAuthorized
        return await eventStore.readEventProperty.call(eventId, propId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    export const readEsEventPropertiesFromEsEvent = async (eventStore: any, fromAddress: string, esEvent: EventTypes.IEsEvent) => {
        let eventId = esEvent.Id
        let propId = 0
        let promises = []
        while (propId < esEvent.PropertyCount) {
            let eventPropVals = await readEsEventPropertyValues(eventStore, fromAddress, eventId, propId)
            let esEventPropWithTruffleTypes = EventTypes.getEsEventPropertyFromEsEventPropertyValues(eventPropVals)
            let esEventProp = EventTypes.getEsEventPropertyFromEsEventPropertyWithTruffleTypes('EsEventProperty', esEventPropWithTruffleTypes)
            promises.push(esEventProp)
            propId++
        }
        return await Promise.all(promises)
    }

    export const readTransmuteEvent = async (eventStore: any, fromAddress: string, eventId: number): Promise<EventTypes.ITransmuteEvent> => {
        let eventVals = await readEsEventValues(eventStore, fromAddress, eventId)
        let esEventWithTruffleTypes: EventTypes.IEsEventFromTruffle = EventTypes.getEsEventFromEsEventValues(eventVals)
        let esEvent: EventTypes.IEsEvent = EventTypes.getEsEventFromEsEventWithTruffleTypes('EsEvent', esEventWithTruffleTypes)

        let esEventProps = await readEsEventPropertiesFromEsEvent(eventStore, fromAddress, esEvent)
        let transmuteEvent = await EventTypes.esEventToTransmuteEvent(esEvent, esEventProps)

        // consider moving this to TransmuteIpfs an exposing dehydrate and rehydrate
        if (typeof transmuteEvent.payload === 'string' && transmuteEvent.payload.indexOf('ipfs/') !== -1) {
            if (!TransmuteFramework.TransmuteIpfs.ipfs) {
                // force local ipfs, protect infura from spam
                TransmuteFramework.TransmuteIpfs.init({
                    host: 'localhost',
                    port: '5001',
                    options: {
                        protocol: 'http'
                    }
                })
            }
           
            let path = transmuteEvent.payload
            //  console.log('path: ', path)
            transmuteEvent.payload = await TransmuteFramework.TransmuteIpfs.readObject(path)
            transmuteEvent.meta.path = path
        }

        if (DEBUG && !isFSA(transmuteEvent)) {
            console.warn('WARNING: transmuteEvent: ', transmuteEvent, ' is not a FSA. see https://github.com/acdlite/flux-standard-action')
        }
        return transmuteEvent
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Number} eventId - all events after this Id and includig it will be returned
    * @return {Promise<EsEvent[], Error>} json objects representing SOLIDITY_EVENTs
    */
    export const readTransmuteEvents = async (eventStore: any, fromAddress: string, eventId: number = 0) => {
        let currentEvent = (await eventStore.solidityEventCount()).toNumber()
        let eventPromises = []
        while (eventId < currentEvent) {
            eventPromises.push(await readTransmuteEvent(eventStore, fromAddress, eventId))
            eventId++
        }
        return await Promise.all(eventPromises)
    }

    // can be extended later to handle validation... maybe...
    export const writeTransmuteCommand = async (eventStore: any, fromAddress: string, transmuteCommand: EventTypes.ITransmuteCommand): Promise<EventTypes.ITransmuteCommandResponse> => {
        let esEvent = EventTypes.convertCommandToEsEvent(transmuteCommand)
        let isIpfsObject = typeof transmuteCommand.payload === 'object' && transmuteCommand.meta && transmuteCommand.meta.handlers.indexOf('ipfs') !== -1
        let hash
        if (isIpfsObject) {
            hash = await TransmuteFramework.TransmuteIpfs.writeObject(transmuteCommand.payload)
            esEvent.ValueType = 'String'
            esEvent.StringValue = 'ipfs/' + hash
            esEvent.PropertyCount = 0
        }
        let tx = await writeEsEvent(eventStore, fromAddress, esEvent)
        let eventsFromWriteEsEvent = await EventTypes.eventsFromTransaction(tx)
        let esEventWithIndex = eventsFromWriteEsEvent[0]
        let esEventProperties = EventTypes.convertCommandToEsEventProperties(esEventWithIndex, transmuteCommand)
        let allTxs = [tx]
        if (esEventWithIndex.PropertyCount) {
            let esEventPropertiesWithTxs = esEventProperties.map(async (esp) => {
                return await writeEsEventProperty(eventStore, fromAddress, esp)
            })
            let txs = await Promise.all(esEventPropertiesWithTxs)
            allTxs = allTxs.concat(txs)
        }
        allTxs = _.flatten(allTxs)
        let transmuteEvents = await Promise.all(EventTypes.reconstructTransmuteEventsFromTxs(allTxs))

        if (isIpfsObject) {
            transmuteEvents[0].payload = transmuteCommand.payload
            transmuteEvents[0].meta.path = 'ipfs/' + hash
        }
        return <EventTypes.ITransmuteCommandResponse>{
            events: transmuteEvents,
            transactions: allTxs
        }
    }

    export const writeTransmuteCommands = async (eventStore: any, fromAddress: string, transmuteCommands: Array<EventTypes.ITransmuteCommand>): Promise<Array<EventTypes.ITransmuteCommandResponse>> => {
        let promises = transmuteCommands.map(async (cmd) => {
            return await writeTransmuteCommand(eventStore, fromAddress, cmd)
        })
        return await Promise.all(promises)
    }
}
