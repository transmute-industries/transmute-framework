'use strict'

import contract from 'truffle-contract'
import { web3 } from '../env'
import eventStoreArtifacts from '../../build/contracts/EventStore.json'

export var EventStore = contract(eventStoreArtifacts)
EventStore.setProvider(web3.currentProvider)

import { eventsFromTransaction } from './Transactions'
import { readModelGenerator } from './ReadModel'

import {
  Persistence
} from './Persistence'


/**
 * @param {EventStore} es - a contract instance which is an Event Store
 * @param {UInt} eventId - all events after this Id and includig it will be returned
 * @return {Promise<NEW_EVENT, Error>} json object representing a Solidity NEW_EVENT
 */
export const readEvent = async (es, eventId) => {
    return {
        Id: eventId,
        Type: await es.getType(eventId),
        Created: (await es.getCreated(eventId)).toNumber(),
        AddressValue: await es.getAddressValue(eventId),
        UIntValue: (await es.getUIntValue(eventId)).toNumber(),
        StringValue: await es.getStringValue(eventId)
    }
}

/**
 * @param {EventStore} es - a contract instance which is an Event Store
 * @param {UInt} eventId - all events after this Id and includig it will be returned
 * @param {Address} fromAddress - the address you wish to deploy these events from
 * @return {Promise<NEW_EVENT[], Error>} json objects representing Solidity NEW_EVENTs
 */
export const readEvents = async (es, eventId = 0) => {
    let currentEvent = await es.eventCount()
    let eventPromises = []
    while (eventId < currentEvent) {
        eventPromises.push(await readEvent(es, eventId))
        eventId++
    }
    return await Promise.all(eventPromises)
}

/**
 * @param {EventStore} es - a contract instance which is an Event Store
 * @param {NEW_EVENT} event - a NEW_EVENT object to be written to the chain
 * @param {Address} fromAddress - the address you wish to deploy these events from
 * @return {Promise<NEW_EVENT, Error>} json object representing the Solidity NEW_EVENT
 */
export const writeEvent = async (es, event, fromAddress) => {
    let tx = await es.emitEvent(event.Type, event.AddressValue, event.UIntValue, event.StringValue, {
        from: fromAddress,
        gas: 2000000
    })
    return eventsFromTransaction(tx)
}

/**
 * @param {EventStore} es - a contract instance which is an Event Store
 * @param {NEW_EVENT} eventArray - an array of NEW_EVENT objects to be written to the chain
 * @param {Address} fromAddress - the address you wish to deploy these events from
 * @return {Promise<NEW_EVENT[], Error>} json objects representing the Solidity NEW_EVENTs which were written to chain
 */
export const writeEvents = async (es, eventArray, fromAddress) => {
    let eventPromises = eventArray
        .map((event) => {
            return es
                .emitEvent(event.Type, event.AddressValue, event.UIntValue, event.StringValue, {
                    from: fromAddress,
                    gas: 2000000
                })
                .then((tx) => {
                    return eventsFromTransaction(tx)
                })
        })
    return await Promise.all(eventPromises)
        .then((newEvents) => {
            return newEvents
        })
}


/**
 * @param {EventStore} es - a contract instance which is an Event Store
 * @param {initialProjectState} readModel - a json object representing the state of a given model
 * @param {projectReducer} reducer - a function which reduces events into a read model state object
 * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
 */
export const maybeSyncReadModel = async (es, readModel, reducer) => {
    let eventCount = (await es.eventCount()).toNumber()
    return Persistence.getItem(readModel.Id)
        .then(async (_readModel) => {
            if (!_readModel) {
                _readModel = readModel
            }
            if (_readModel.EventCount === eventCount) {
                return false
            }
            let events = await readEvents(es, _readModel.EventCount || 0)
            let updatedReadModel = readModelGenerator(_readModel, reducer, events)
            return Persistence.setItem(updatedReadModel.Id, updatedReadModel)
        })
}

export default {
    EventStore,
    writeEvent,
    writeEvents,
    readEvent,
    readEvents,
    readModelGenerator,
    maybeSyncReadModel
}
