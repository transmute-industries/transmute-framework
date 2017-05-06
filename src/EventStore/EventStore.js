'use strict'

import contract from 'truffle-contract'
import { web3 } from '../env'
import eventStoreArtifacts from '../../build/contracts/EventStore.json'

const ES = contract(eventStoreArtifacts)
ES.setProvider(web3.currentProvider)

import { eventsFromTransaction } from './Transactions'

/**
* @param {EventStore} es - a contract instance which is an Event Store
* @param {UInt} eventId - all events after this Id and includig it will be returned
* @return {Promise<NEW_EVENT, Error>} json object representing a Solidity NEW_EVENT
*/
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

/**
* @param {EventStore} es - a contract instance which is an Event Store
* @param {UInt} eventId - all events after this Id and includig it will be returned
* @param {Address} fromAddress - the address you wish to deploy these events from
* @return {Promise<NEW_EVENT[], Error>} json objects representing Solidity NEW_EVENTs
*/
const readEvents = async (es, eventId = 0) => {
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
const writeEvent = async (es, transmuteEvent, fromAddress) => {
  let tx = await es.emitEvent(transmuteEvent.Type, transmuteEvent.AddressValue, transmuteEvent.UIntValue, transmuteEvent.StringValue, {
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
const writeEvents = async (es, eventArray, fromAddress) => {
  let eventPromises = eventArray
  .map((transmuteEvent) => {
    return es
    .emitEvent(transmuteEvent.Type, transmuteEvent.AddressValue, transmuteEvent.UIntValue, transmuteEvent.StringValue, {
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

export const EventStore = {
  ES,
  readEvent,
  readEvents,
  writeEvent,
  writeEvents
}
