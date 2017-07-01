'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()
import { EventTypes } from '../EventTypes/EventTypes'

import { isFSA } from 'flux-standard-action'
import * as _ from 'lodash'

import { assert, expect, should } from 'chai'

import {
    addressCommand,
    numberCommand,
    stringCommand,
    objectCommand,
    ipfsObjectCommand

} from '../Mock/Events/TestEvents'

describe('EventStore IO', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    // command types and event types should be different... smells... not great...
    describe('.writeTransmuteCommand', () => {

        it('should validate and write addressCommand as an EsEvent but return an ITransmuteEvent', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, addressCommand.type)
            assert.equal(cmdResponse.events[0].payload, addressCommand.payload)
        })

        it('should validate and write numberCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, numberCommand.type)
            assert.equal(cmdResponse.events[0].payload, numberCommand.payload)
        })

        it('should validate and write stringCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, stringCommand.type)
            assert.equal(cmdResponse.events[0].payload, stringCommand.payload)
        })

        it('should validate and write ipfsObjectCommand as an EsEvent with EsEventProperties but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], ipfsObjectCommand)
            // console.log(cmdResponse.events[0])
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, ipfsObjectCommand.type)
            assert(_.isEqual(cmdResponse.events[0].payload, ipfsObjectCommand.payload))
        })
    })


    describe('.readTransmuteEvent', () => {
        it('read address value event should return an FSA with event store meta', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
            let eventIndex = cmdResponse.events[0].meta.id
            let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
        })

        it('read number value event should return an FSA with event store meta', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
            let eventIndex = cmdResponse.events[0].meta.id
            let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
        })

        it('read string value event should return an FSA with event store meta', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
            let eventIndex = cmdResponse.events[0].meta.id
            let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
        })

        it('write an objectCommand and then read it', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], ipfsObjectCommand)
            let eventIndex = cmdResponse.events[0].meta.id
            // console.log('cmdResponse: ', cmdResponse.events[0].meta.path)
            let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
            assert.equal(transmuteEvent.meta.path, '/ipfs/Qmc1JeeB3FheBYaMRFcwT6v5pwmhxeh7pGmVNuQPekA7m9', 'expected meta.has to be command payload')
        })

        it('read object value event should return an FSA with event store meta', async () => {
            let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], objectCommand)
            let eventIndex = cmdResponse.events[0].meta.id
            let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
        })
    })

    describe('.readTransmuteEvents', () => {
        let initialEventId, commands, cmdResponses
        before(async () => {
            initialEventId = (await eventStore.solidityEventCount()).toNumber()
            commands = [addressCommand, numberCommand, stringCommand, objectCommand]
            cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
            assert.lengthOf(cmdResponses, commands.length)
        })
        it('should return all transmute events after and including the given eventId', async () => {
            let transmuteEvents = await TransmuteFramework.EventStore.readTransmuteEvents(eventStore, web3.eth.accounts[0], initialEventId)
            assert.lengthOf(transmuteEvents, commands.length)
            // Add more tests here...
        })
    })

    describe('.writeTransmuteCommands', () => {
        it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
            let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
            let cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
            assert.lengthOf(cmdResponses, commands.length)
            // add more tests here...
        })
    })

})
