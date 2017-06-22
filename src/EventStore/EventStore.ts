
const { keys, pick, omit, flatten, difference, extend } = require('lodash')

import { EventTypes } from './EventTypes/EventTypes'
import { EventStoreFactory } from './Factory/EventStoreFactory'
import { Persistence } from './Persistence/Persistence'

import * as _ from 'lodash'

import { isFSA } from 'flux-standard-action'

let DEBUG = true; //should be only for dev envs for performance reasons...

import { ITransmuteFramework } from '../TransmuteFramework'

export class EventStore {

    // Add modules here for convenience
    EventTypes = EventTypes
    EventStoreFactory = EventStoreFactory
    Persistence = Persistence

    constructor(
        public framework: ITransmuteFramework,
    ) {
    }

    writeEsEvent = async (
        eventStore: any,
        fromAddress: string,
        esEvent: EventTypes.IEsEvent
    ): Promise<EventTypes.ITransaction> => {
        let {
            Type,
            Version,
            ValueType,
            IsAuthorized,
            PermissionDomain,
            AddressValue,
            UIntValue,
            Bytes32Value,
            StringValue
        } = esEvent
        return await eventStore.writeEvent(
            Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue,
            {
                from: fromAddress,
                gas: 2000000
            })
    }

    readEsEventValues = async (eventStore: any, fromAddress: string, eventId: number) => {
        // must be a .call constant modifier incompatible with _isAuthorized
        return await eventStore.readEvent.call(eventId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    /**
   * @param {TruffleContract} eventStore - a contract instance which is an Event Store
   * @param {Address} fromAddress - the address you wish to deploy these events from
   * @param {Number} eventId - the event ID to be read
   * @return {Promise<EventTypes.ITransmuteEvent>} - a json object of type ITransmuteEvent
   */
    readTransmuteEvent = async (eventStore: any, fromAddress: string, eventId: number): Promise<EventTypes.ITransmuteEvent> => {
        let eventVals = await this.readEsEventValues(eventStore, fromAddress, eventId)
        let esEventWithTruffleTypes: EventTypes.IEsEventFromTruffle = EventTypes.getEsEventFromEsEventValues(eventVals)
        let esEvent: EventTypes.IEsEvent = EventTypes.getEsEventFromEsEventWithTruffleTypes('EsEvent', esEventWithTruffleTypes)

        let transmuteEvent = await EventTypes.esEventToTransmuteEvent(esEvent)

        // consider moving this to TransmuteIpfs an exposing dehydrate and rehydrate
        if (typeof transmuteEvent.payload === 'string' && transmuteEvent.payload.indexOf('ipfs/') !== -1) {
            if (!this.framework.TransmuteIpfs.ipfs) {
                // force local ipfs, protect infura from spam
                this.framework.TransmuteIpfs.init({
                    host: 'localhost',
                    port: '5001',
                    options: {
                        protocol: 'http'
                    }
                })
            }

            let path = transmuteEvent.payload
            //  console.log('path: ', path)
            transmuteEvent.payload = await this.framework.TransmuteIpfs.readObject(path)
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
    readTransmuteEvents = async (eventStore: any, fromAddress: string, eventId: number = 0) => {
        let currentEvent = (await eventStore.solidityEventCount()).toNumber()
        let eventPromises = []
        while (eventId < currentEvent) {
            eventPromises.push(await this.readTransmuteEvent(eventStore, fromAddress, eventId))
            eventId++
        }
        return await Promise.all(eventPromises)
    }

    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Address} fromAddress - the address you wish to deploy these events from
    * @param {ITransmuteCommand} transmuteCommand - an FSA object to be written to the chain
    * @return {Promise<EventTypes.ITransmuteCommandResponse>} - an ITransmuteCommandResponse object
    */
    writeTransmuteCommand = async (eventStore: any, fromAddress: string, transmuteCommand: EventTypes.ITransmuteCommand): Promise<EventTypes.ITransmuteCommandResponse> => {
        let esEvent = EventTypes.convertCommandToEsEvent(transmuteCommand)
        let isIpfsObject = typeof transmuteCommand.payload === 'object'
        let hash
        // NOTE: We are only supporting IPFS for object storage from now on.
        // IPLD and TransmuteIPFS can be better integrated now that we are focusing on supporting them.
        if (isIpfsObject) {
            hash = await this.framework.TransmuteIpfs.writeObject(transmuteCommand.payload)
            esEvent.ValueType = 'String'
            esEvent.StringValue = 'ipfs/' + hash
        }
        let tx = await this.writeEsEvent(eventStore, fromAddress, esEvent)
        let eventsFromWriteEsEvent = await EventTypes.eventsFromTransaction(tx)
        let esEventWithIndex = eventsFromWriteEsEvent[0]
        let allTxs = [tx]
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

    /**
     * @param {TruffleContract} eventStore - a contract instance which is an Event Store
     * @param {Address} fromAddress - the address you wish to deploy these events from
     * @param {Array<ITransmuteCommand>} transmuteCommands - an array of FSA objects to be written to the chain
     * @return {Array<EventTypes.ITransmuteCommandResponse>} - an array of transmute command responses
     */
    writeTransmuteCommands = async (eventStore: any, fromAddress: string, transmuteCommands: Array<EventTypes.ITransmuteCommand>): Promise<Array<EventTypes.ITransmuteCommandResponse>> => {
        let promises = transmuteCommands.map(async (cmd) => {
            return await this.writeTransmuteCommand(eventStore, fromAddress, cmd)
        })
        return await Promise.all(promises)
    }

    /**
    * @type {Function} readModelGenerator - transform an event stream into a json object
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @param {Object[]} events - events from an eventStore contract
    */
    readModelGenerator = (readModel: EventTypes.IReadModel, reducer: any, events: Array<EventTypes.ITransmuteEvent>): EventTypes.IReadModel => {
        events.forEach((event) => {
            readModel = reducer(readModel, event)
        })
        return <EventTypes.IReadModel>readModel
    }

    /**
    * @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
    * @param {Contract} eventStore - a contract instance which is an Event Store
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
    */
    maybeSyncReadModel = async (eventStore: any, fromAddress: string, readModel: EventTypes.IReadModel, reducer: any): Promise<EventTypes.IReadModel> => {
        // console.log('called: ')
        let solidityEventCount = (await eventStore.solidityEventCount()).toNumber()
        // console.log('solidityEventCount: ', solidityEventCount)
        return this.framework.Persistence.LocalStore.getItem(readModel.readModelStoreKey)
            .then(async (_readModel: EventTypes.IReadModel) => {
                if (!_readModel) {
                    _readModel = readModel
                }
                if (_readModel.lastEvent === solidityEventCount) {
                    return readModel
                }
                // console.log('_readModel: ', _readModel)
                let startIndex = _readModel.lastEvent !== null ? _readModel.lastEvent + 1 : 0
                let events = await this.readTransmuteEvents(eventStore, fromAddress, startIndex)
                // console.log('events: ', events)
                let updatedReadModel = this.readModelGenerator(_readModel, reducer, events)
                return <any>this.framework.Persistence.LocalStore.setItem(updatedReadModel.readModelStoreKey, updatedReadModel)
            })
    }


    getCachedReadModel = async (
        contractAddress: string,
        eventStore: any,
        fromAddress: string,
        readModel: EventTypes.IReadModel,
        reducer: any
    ) => {
        readModel.readModelStoreKey = `${readModel.readModelType}:${contractAddress}`
        readModel.contractAddress = contractAddress
        readModel = await this.maybeSyncReadModel(eventStore, fromAddress, readModel, reducer)
        return readModel
    }

}
