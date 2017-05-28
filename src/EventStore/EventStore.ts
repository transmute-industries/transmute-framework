'use strict'

import { web3 } from '../env'

import { Middleware } from './Middleware/Middleware'
import { ReadModel } from './ReadModel/ReadModel'

export module EventStore{

    export const ReadModelGenerator = ReadModel

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Number} eventId - all events after this Id and includig it will be returned
    * @return {Promise<EsEvent, Error>} json object representing a Solidity EsEvent
    */
    export const readEvent = async (es, eventId) => {
        // return Middleware.readSolidityEventAsync(es, eventId)
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Number} eventId - all events after this Id and includig it will be returned
    * @return {Promise<EsEvent[], Error>} json objects representing SOLIDITY_EVENTs
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
    * @param {EsEvent} event - a EsEvent object to be written to the chain
    * @param {Address} fromAddress - the address you wish to deploy these events from
    * @return {Promise<EsEvent, Error>} json object representing the Solidity EsEvent
    */
    export const writeEvent = async (es, transmuteEvent, fromAddress) => {
        let meta = {
            from: fromAddress,
            gas: 2000000
        }
        // return await Middleware.writeSolidityEventAsync(es, meta, transmuteEvent)
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {EsEvent} eventArray - an array of EsEvent objects to be written to the chain
    * @param {Address} fromAddress - the address you wish to deploy these events from
    * @return {Promise<EsEvent[], Error>} json objects representing the SOLIDITY_EVENTs which were written to chain
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

}
