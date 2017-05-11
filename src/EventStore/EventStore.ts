'use strict'

import { web3 } from '../env'

const contract  = require('truffle-contract') 
const eventStoreArtifacts = require('../../build/contracts/EventStore')

var ES = contract(eventStoreArtifacts)
ES.setProvider(web3.currentProvider)

import {
  Middleware
} from './Middleware/Middleware'

/**
* @param {TruffleContract} eventStore - a contract instance which is an Event Store
* @param {Number} eventId - all events after this Id and includig it will be returned
* @return {Promise<SOLIDITY_EVENT, Error>} json object representing a Solidity SOLIDITY_EVENT
*/
export const readEvent = async (es, eventId) => {
  return Middleware.readSolidityEventAsync(es, eventId)
}

/**
* @param {TruffleContract} eventStore - a contract instance which is an Event Store
* @param {Number} eventId - all events after this Id and includig it will be returned
* @return {Promise<SOLIDITY_EVENT[], Error>} json objects representing SOLIDITY_EVENTs
*/
export const readEvents = async (es, eventId = 0) => {
  let currentEvent = await es.solidityEventCount()
  let eventPromises = []
  while (eventId < currentEvent) {
    eventPromises.push(await readEvent(es, eventId))
    eventId++
  }
  return await Promise.all(eventPromises)
}

/**
* @param {TruffleContract} eventStore - a contract instance which is an Event Store
* @param {SOLIDITY_EVENT} event - a SOLIDITY_EVENT object to be written to the chain
* @param {Address} fromAddress - the address you wish to deploy these events from
* @return {Promise<SOLIDITY_EVENT, Error>} json object representing the Solidity SOLIDITY_EVENT
*/
export const writeEvent = async (es, transmuteEvent, fromAddress) => {
  let meta = {
    from: fromAddress,
    gas: 2000000
  }
  // console.log('writeSolidityEventAsync: ', transmuteEvent)
  return await Middleware.writeSolidityEventAsync(es, meta, transmuteEvent)
}

/**
* @param {TruffleContract} eventStore - a contract instance which is an Event Store
* @param {SOLIDITY_EVENT} eventArray - an array of SOLIDITY_EVENT objects to be written to the chain
* @param {Address} fromAddress - the address you wish to deploy these events from
* @return {Promise<SOLIDITY_EVENT[], Error>} json objects representing the SOLIDITY_EVENTs which were written to chain
*/
export const writeEvents = async (es, eventArray, fromAddress) => {

  let eventPromises = eventArray
    .map((transmuteEvent) => {
      return writeEvent(es, transmuteEvent, fromAddress)
    })
  return await Promise.all(eventPromises)
    .then((newEvents) => {
      return newEvents
    })
}



/**
* @property {TruffleContract} ES - a truffle contract which is an EventStore
* @property {readEvent} readEvent - read a single event by ID
* @property {readEvents} readEvents - read a single event by ID, and all events after it
* @property {writeEvent} writeEvent - write a single event
* @property {writeEvents} writeEvents - write an array of events
*/
export const EventStore = {
  ES,
  readEvent,
  readEvents,
  writeEvent,
  writeEvents
}
