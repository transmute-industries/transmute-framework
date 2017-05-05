'use strict'

import contract from 'truffle-contract'
import { web3 } from '../env'
import eventStoreArtifacts from '../../build/contracts/EventStore.json'

var EventStore = contract(eventStoreArtifacts)
EventStore.setProvider(web3.currentProvider)

import { eventsFromTransaction } from './Transactions'
import { readModelGenerator } from './ReadModel'

import {
    getItem,
    setItem
} from './Persistence'

const readEvent = async (es, eventId) => {
    return {
        Id: eventId,
        Type: await es.getType(eventId),
        Created: (await es.getCreated(eventId)).toNumber(),
        AddressValue: await es.getAddressValue(eventId),
        UIntValue: (await es.getUIntValue(eventId)).toNumber(),
        StringValue: await es.getStringValue(eventId)
    }
}

const readEvents = async (es, eventId = 0) => {
    let currentEvent = await es.eventCount()
    let eventPromises = []
    while (eventId < currentEvent) {
        eventPromises.push(await readEvent(es, eventId))
        eventId++
    }
    return await Promise.all(eventPromises)
}

const writeEvent = async (es, event, fromAddress) => {
    let tx = await es.emitEvent(event.Type, event.AddressValue, event.UIntValue, event.StringValue, {
        from: fromAddress,
        gas: 2000000
    })
    return eventsFromTransaction(tx)
}

const writeEvents = async (es, eventArray, fromAddress) => {
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


const maybeSyncReadModel = async (es, readModel, reducer) => {
    let eventCount = (await es.eventCount()).toNumber()
    return getItem(readModel.Id)
        .then(async (_readModel) => {
            if (!_readModel) {
                _readModel = readModel
            }
            if (_readModel.EventCount === eventCount) {
                return false
            }
            let events = await readEvents(es, _readModel.EventCount || 0)
            let updatedReadModel = readModelGenerator(_readModel, reducer, events)
            return setItem(updatedReadModel.Id, updatedReadModel)
        })
}

export default {
    EventStore,
    writeEvent,
    writeEvents,
    readEvent,
    readEvents,
    getItem,
    setItem,
    readModelGenerator,
    maybeSyncReadModel
}
