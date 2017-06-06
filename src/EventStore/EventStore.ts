'use strict'
import { TransmuteFramework }  from '../TransmuteFramework'


// const { web3 } = TransmuteFramework
// .init({
//     env: 'testrpc'
// })

let web3

import { EventTypes as ET } from './EventTypes/EventTypes'
import { Middleware } from './Middleware/Middleware'
import { ReadModel as RM } from './ReadModel/ReadModel'

export module EventStore {
    export import EventTypes = ET
    export import ReadModel = RM

    /**
     * @param {TruffleContract} eventStore - a contract instance which is an Event Store
     * @param {Address} fromAddress - the address you wish to deploy these events from
     * @param {ITransmuteCommand} transmuteCommand - an FSA object to be written to the chain
     * @return {Promise<EventTypes.ITransmuteCommandResponse>} - an ITransmuteCommandResponse object
     */
    export const writeTransmuteCommand = async (
        eventStore: any,
        fromAddress: string,
        transmuteCommand: EventTypes.ITransmuteCommand
    ): Promise<EventTypes.ITransmuteCommandResponse> => {
        // Analytics middleware can be added here...
        return await Middleware.writeTransmuteCommand(eventStore, fromAddress, transmuteCommand)
    }

    /**
     * @param {TruffleContract} eventStore - a contract instance which is an Event Store
     * @param {Address} fromAddress - the address you wish to deploy these events from
     * @param {Array<ITransmuteCommand>} transmuteCommands - an array of FSA objects to be written to the chain
     * @return {Array<EventTypes.ITransmuteCommandResponse>} - an array of transmute command responses
     */
    export const writeTransmuteCommands = async (
        eventStore: any,
        fromAddress: string,
        transmuteCommands: Array<EventTypes.ITransmuteCommand>
    ): Promise<Array<EventTypes.ITransmuteCommandResponse>> => {
        // Analytics middleware can be added here...
        return await Middleware.writeTransmuteCommands(eventStore, fromAddress, transmuteCommands)
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Address} fromAddress - the address you wish to deploy these events from
    * @param {Number} eventId - the event ID to be read
    * @return {Promise<EventTypes.ITransmuteEvent>} - a json object of type ITransmuteEvent
    */
    export const readTransmuteEvent = async (eventStore: any, fromAddress: string, eventId: number): Promise<EventTypes.ITransmuteEvent> => {
        return Middleware.readTransmuteEvent(eventStore, fromAddress, eventId)
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Address} fromAddress - the address you wish to deploy these events from
    * @param {Number} eventId - the event ID to read from and including
    * @return {Promise<Array<EventTypes.ITransmuteEvent>>} - an array of json objects of type ITransmuteEvent
    */
    export const readTransmuteEvents = async (eventStore: any, fromAddress: string, eventId: number): Promise<Array<EventTypes.ITransmuteEvent>> => {
        return Middleware.readTransmuteEvents(eventStore, fromAddress, eventId)
    }

}
