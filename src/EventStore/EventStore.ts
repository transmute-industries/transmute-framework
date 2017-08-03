
const { keys, pick, omit, flatten, difference, extend } = require('lodash')

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
        // console.log('read value: ', esEventValues)
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


    readEsEventValues = async (eventStore: any, fromAddress: string, eventId: number) => {  // @Orie, should this be a constant since it is a call fn? Also, don't need gas, etc.
        return await eventStore.readEvent.call(eventId, {
            from: fromAddress,
            gas: 2000000
        })
    }
    // probably should return TX here tooo
    writeFSA = async (eventStore: any, fromAddress: string, fsa: IFSACommand): Promise<IFSAEvent> => {

        if (fsa.payload.length) {
            throw ('fsa payload cannot be an array')
        }
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

        // ----------------------------------------------
        // expect().to.throw('Property does not exist in model schema.');

        function isHex(h) {
            var a = parseInt(h,16).toString(16)
            var b = ('0x' == h.substring(0,2)) 
                    ? h.toLowerCase().substring(2)  
                    : h.toLowerCase() 
            return a === b.replace(/^0+/, '');
        }
        
        if (key == 'bytes32') {
            if (valueType == 'X') {
                // check proper length
                if (value.length > 66) {
                    throw ('solidity bytes32 type exceeded 32 bytes: ' + value.length + ' nybbles')
                }
                // check hex chars only 0-F
                if (!isHex(value)) {
                    throw('solidity bytes32 received invalid hex string: ' + value)
                }
            } else if (valueType == 'S') {
                // check length of string
                if (value.length > 32) {
                    throw ('solidity bytes32 type exceeded 32 bytes: ' + value.length + ' chars')
                }
            }
            else throw ('Wrong type!' )
        }
        console.log('k ' + key)
        console.log('kt ' + keyType)
        console.log('v ' + value)
        console.log('vt ' + valueType)
        // ----------------------------------------------

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
        let currentEvent = (await eventStore.eventCount.call({ from: fromAddress })).toNumber()
        let eventPromises = []
        while (eventId < currentEvent) {
            let fsa = await this.readFSA(eventStore, fromAddress, eventId)
            eventPromises.push(fsa)
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



}
