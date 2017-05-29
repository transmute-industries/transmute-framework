
const { keys, pick, omit, flatten, difference, extend } = require('lodash')
import { web3 } from '../../env'

import { EventTypes } from '../EventTypes/EventTypes'

import { Transactions } from '../Transactions/Transactions'

import * as _ from 'lodash'

import { isFSA } from 'flux-standard-action'

let DEBUG = true; //should be only for dev envs for performance reasons...

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

    // can be extended later to handle validation... maybe...
    export const writeTransmuteCommand = async (eventStore: any,  fromAddress: string, transmuteCommand: EventTypes.ITransmuteCommand): Promise<ITransmuteCommandResponse>  => {
        // console.log('transmuteCommand: ', transmuteCommand)
        let esEvent = EventTypes.convertCommandToEsEvent(transmuteCommand)
        // console.log('esEvent: ', esEvent)
        let tx = await writeEsEvent(eventStore, fromAddress, esEvent)
        let eventsFromWriteEsEvent = await Transactions.eventsFromTransaction(tx)
        // console.log('eventsFromWriteEsEvent', eventsFromWriteEsEvent)
        let esEventWithIndex = eventsFromWriteEsEvent[0]
        let esEventProperties = EventTypes.convertCommandToEsEventProperties(esEventWithIndex, transmuteCommand)
        // console.log('esEventProperties: ', esEventProperties)
        let allTxs = [tx]
        if(esEventWithIndex.PropertyCount){
            let esEventPropertiesWithTxs = esEventProperties.map(async (esp) =>{
                return await writeEsEventProperty(eventStore, fromAddress, esp)
            })
            let txs = await Promise.all(esEventPropertiesWithTxs)
            allTxs = allTxs.concat(txs)
        }
       
        allTxs = _.flatten(allTxs)
        // console.log('allTxs: ', allTxs)
        let transmuteEvents =  await Promise.all(Transactions.reconstructTransmuteEventsFromTxs(allTxs))
        return <ITransmuteCommandResponse> {
            events: transmuteEvents,
            transactions: allTxs
        }
    }
}
