
const { keys, pick, omit, flatten, difference, extend } = require('lodash')

import { EventStoreFactory } from './Factory/EventStoreFactory'
import { Persistence } from './Persistence/Persistence'

import * as _ from 'lodash'

import { isFSA } from 'flux-standard-action'

let DEBUG = true; //should be only for dev envs for performance reasons...

import { ITransmuteFramework } from '../TransmuteFramework'


import {
    IFSACommand,
    IFSAEvent,
    IUnmarshalledEsCommand,
    marshal,
    getFSAFromEventValues
} from './Utils/Common'

import * as Common from './Utils/Common'



export class EventStore {

    // Add modules here for convenience
    EventStoreFactory = EventStoreFactory
    Persistence = Persistence
    Common = Common

    constructor(
        public framework: ITransmuteFramework,
    ) {
    }

    writeUnmarshalledEsCommand = async (
        eventStore: any,
        fromAddress: string,
        esEvent: IUnmarshalledEsCommand
    ): Promise<Common.ITransaction> => {

        let marshalledEvent = marshal(
            esEvent.eventType,
            esEvent.keyType,
            esEvent.valueType,
            esEvent.key,
            esEvent.value
        )

        return await eventStore.writeEvent(
            marshalledEvent.eventType,
            marshalledEvent.keyType,
            marshalledEvent.valueType,
            marshalledEvent.key,
            marshalledEvent.value,
            { from: fromAddress, gas: 2000000 }
        )

    }

    readFSA = async (eventStore: any, fromAddress: string, eventId: number) => {
        let esEventValues = await this.readEsEventValues(eventStore, fromAddress, eventId)
        let fsa = getFSAFromEventValues(
            esEventValues[0],
            esEventValues[1],
            esEventValues[2],
            esEventValues[3],
            esEventValues[4],
            esEventValues[5],
            esEventValues[6],
            esEventValues[7]
        )
        // console.log("fsa.meta.keyType", fsa.meta.keyType)
        // console.log("fsa.meta.valueType", fsa.meta.valueType)
        if (fsa.meta.valueType === 'I') {
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
            //  console.log('path: ', path)
            let path = fsa.payload.multihash
            fsa.payload = await this.framework.TransmuteIpfs.readObject(path)
            // remove circular refernce from IPLD
            fsa.payload = JSON.parse(JSON.stringify(fsa.payload))
            fsa.meta.multihash = path
        }
        return fsa;
    }


    readEsEventValues = async (eventStore: any, fromAddress: string, eventId: number) => {
        return await eventStore.readEvent.call(eventId, {
            from: fromAddress,
            gas: 2000000
        })
    }

    writeFSA = async (eventStore: any, fromAddress: string, fsa: IFSACommand): Promise<IFSAEvent> => {
        let payloadKeys = Object.keys(fsa.payload)
        // need to check size here and throw errors for very long strings
        let valueType, keyType, key, value
        if (payloadKeys.length > 1) {
            // CONVERT TO IPLD 
            valueType = 'I'
            let hash = await this.framework.TransmuteIpfs.writeObject(fsa.payload)
            // console.log(hash)
            key = 'multihash'
            value = hash
        } else {
            valueType = Common.guessTypeFromValue(fsa.payload[payloadKeys[0]])
            // console.log('valueType: ', valueType)
            key = payloadKeys[0]
            value = fsa.payload[payloadKeys[0]]
        }
        let unmarshalledEsCommand: IUnmarshalledEsCommand = {
            eventType: fsa.type,
            keyType: 'X',
            valueType: valueType,
            key: key,
            value: value
        }
        let tx = await this.writeUnmarshalledEsCommand(eventStore, fromAddress, unmarshalledEsCommand)
        // console.log(tx)
        let event = tx.logs[0].args
        return Common.getFSAFromEventArgs(event)
    }
    /**
    * @param {TruffleContract} eventStore - a contract instance which is an Event Store
    * @param {Number} eventId - all events after this Id and includig it will be returned
    * @return {Promise<EsEvent[], Error>} json objects representing SOLIDITY_EVENTs
    */
    readFSAs = async (eventStore: any, fromAddress: string, eventId: number = 0) => {
        let currentEvent = (await eventStore.solidityEventCount()).toNumber()
        let eventPromises = []
        while (eventId < currentEvent) {
            eventPromises.push(await this.readFSA(eventStore, fromAddress, eventId))
            eventId++
        }
        return await Promise.all(eventPromises)
    }


    /**
     * @param {TruffleContract} eventStore - a contract instance which is an Event Store
     * @param {Address} fromAddress - the address you wish to deploy these events from
     * @param {Array<ITransmuteCommand>} transmuteCommands - an array of FSA objects to be written to the chain
     * @return {Array<EventTypes.ITransmuteCommandResponse>} - an array of transmute command responses
     */
    writeFSAs = async (eventStore: any, fromAddress: string, transmuteCommands: Array<Common.IFSACommand>): Promise<Array<Common.IFSAEvent>> => {
        let promises = transmuteCommands.map(async (cmd) => {
            return await this.writeFSA(eventStore, fromAddress, cmd)
        })
        return await Promise.all(promises)
    }

    /**
    * @type {Function} readModelGenerator - transform an event stream into a json object
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @param {Object[]} events - events from an eventStore contract
    */
    readModelGenerator = (readModel: Common.IReadModel, reducer: any, events: Array<Common.IFSAEvent>): Common.IReadModel => {
        events.forEach((event) => {
            readModel = reducer(readModel, event)
        })
        return <Common.IReadModel>readModel
    }

    /**
    * @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
    * @param {Contract} eventStore - a contract instance which is an Event Store
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
    */
    maybeSyncReadModel = async (eventStore: any, fromAddress: string, readModel: Common.IReadModel, reducer: any): Promise<Common.IReadModel> => {
        // console.log('called: ')
        let solidityEventCount = (await eventStore.solidityEventCount()).toNumber()
        // console.log('solidityEventCount: ', solidityEventCount)
        return this.framework.Persistence.LocalStore.getItem(readModel.readModelStoreKey)
            .then(async (_readModel: Common.IReadModel) => {
                if (!_readModel) {
                    _readModel = readModel
                }
                if (_readModel.lastEvent === solidityEventCount) {
                    return readModel
                }
                // console.log('_readModel: ', _readModel)
                let startIndex = _readModel.lastEvent !== null ? _readModel.lastEvent + 1 : 0
                let events = await this.readFSAs(eventStore, fromAddress, startIndex)
                // console.log('events: ', events)
                let updatedReadModel = this.readModelGenerator(_readModel, reducer, events)
                return <any>this.framework.Persistence.LocalStore.setItem(updatedReadModel.readModelStoreKey, updatedReadModel)
            })
    }


    getCachedReadModel = async (
        contractAddress: string,
        eventStore: any,
        fromAddress: string,
        readModel: Common.IReadModel,
        reducer: any
    ) => {
        readModel.readModelStoreKey = `${readModel.readModelType}:${contractAddress}`
        readModel.contractAddress = contractAddress
        readModel = await this.maybeSyncReadModel(eventStore, fromAddress, readModel, reducer)
        return readModel
    }

}
