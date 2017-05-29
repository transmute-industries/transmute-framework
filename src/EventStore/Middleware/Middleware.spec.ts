'use strict'
import { isFSA } from 'flux-standard-action'
import * as _ from 'lodash'
const contract = require('truffle-contract')

import { assert, expect, should } from 'chai'
import { web3 } from '../../env'

import { Middleware } from './Middleware'
import { EventTypes } from '../EventTypes/EventTypes'

const eventStoreArtifacts = require('../../../build/contracts/EventStore')

import {
    addressValueEsEvent,
    bytes32ValueEsEvent,
    uIntValueEsEvent,

    addressValueEsEventProperty,
    uIntValueEsEventProperty,
    bytes32ValueEsEventProperty,


    addressCommand,
    numberCommand,
    stringCommand,
    objectCommand

} from '../Mock/Events/TestEvents'

export const EventStoreContract = contract(eventStoreArtifacts)
EventStoreContract.setProvider(web3.currentProvider)

describe('Middleware', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('writeEsEvent', () => {
        it('should return a tx containing an EsEvent in logs', async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            // console.log(tx)
        })
    })

    describe('writeEsEventProperty', () => {
        // TODO: add more tests for EsEventProperties

        it('should return a tx containing an EsEvent in logs', async () => {
            let eventIndex = (await eventStore.solidityEventCount()).toNumber()
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            addressValueEsEventProperty.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], addressValueEsEventProperty)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
            let eventFromPropTx = tx.logs[0].args
            assert.equal(EventTypes.toAscii(eventFromPropTx.ValueType), addressValueEsEventProperty.ValueType)
            // console.log(eventFromPropTx)
        })
    })

    // Then add tests for reading 

    describe('readEsEventValues', () => {
        before(async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
        })

        it('should return eventValues as truffle types (unusable)', async () => {
            let eventValues = await Middleware.readEsEventValues(eventStore, web3.eth.accounts[0], 0)
            // console.log(eventValues)
            assert.equal(eventValues[0].toNumber(), 0)
            assert.lengthOf(eventValues, 10)

        })
    })

    describe('readEsEventPropertyValues', () => {
        let eventIndex
        let txArgs
        before(async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            txArgs = tx.logs[0].args
            eventIndex = tx.logs[0].args.Id.toNumber()
            addressValueEsEventProperty.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], addressValueEsEventProperty)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
        })

        it('should return eventValues as truffle types (unusable)', async () => {
            let eventPropVals = await Middleware.readEsEventPropertyValues(eventStore, web3.eth.accounts[0], eventIndex, 0)
            // console.log(eventPropVals)
            // These comparisons are not on truffle types
            assert.equal(eventPropVals[0].toNumber(), eventIndex)
            assert.equal(eventPropVals[1].toNumber(), 0)
            assert.equal(EventTypes.toAscii(eventPropVals[2]), addressValueEsEventProperty.Name)
            assert.equal(EventTypes.toAscii(eventPropVals[3]), addressValueEsEventProperty.ValueType)
            assert.equal(eventPropVals[4], addressValueEsEventProperty.AddressValue)
            assert.equal(eventPropVals[5].toNumber(), addressValueEsEventProperty.UIntValue)
            assert.equal(EventTypes.toAscii(eventPropVals[6]), addressValueEsEventProperty.Bytes32Value)
            // assert.lengthOf(eventPropVals, 10)

        })
    })

    describe('readTransmuteEvent', () => {

        it('read address value event should return an FSA with event store meta', async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            let eventIndex = tx.logs[0].args.Id.toNumber()
            let txArgs = tx.logs[0].args
            let transmuteEvent = await Middleware.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
            assert.equal(transmuteEvent.payload, txArgs.AddressValue, 'expected payload to match address value in transaction event log')
            assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
        })

        it('read uint value event should return an FSA with event store meta', async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], uIntValueEsEvent)
            let eventIndex = tx.logs[0].args.Id.toNumber()
            let txArgs = tx.logs[0].args
            // console.log(txArgs)
            let transmuteEvent = await Middleware.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
            assert.equal(transmuteEvent.payload, txArgs.UIntValue.toNumber(), 'expected payload to match uintValue.toNumber() from transaction event log')
            assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
        })

        it('read bytes32 value event should return an FSA with event store meta', async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], bytes32ValueEsEvent)
            let eventIndex = tx.logs[0].args.Id.toNumber()
            let txArgs = tx.logs[0].args
            // console.log(txArgs)
            let transmuteEvent = await Middleware.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
            assert.equal(isFSA(transmuteEvent), true)
            assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
            assert.equal(transmuteEvent.payload, EventTypes.toAscii(txArgs.Bytes32Value), 'expected payload to match ascii(bytes32Value) in transaction event log')
            assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
            // console.log(transmuteEvent)
        })
    })

    // command types and event types should be different... smells... not great...
    describe('writeTransmuteCommand', () => {

        it('should validate and write addressCommand as an EsEvent but return an ITransmuteEvent', async () => {
            let cmdResponse = await Middleware.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
            // console.log('cmdResponse: ', cmdResponse)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, addressCommand.type)
            assert.equal(cmdResponse.events[0].payload, addressCommand.payload)
        })

        it('should validate and write numberCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await Middleware.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
            // console.log('cmdResponse: ', cmdResponse)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, numberCommand.type)
            assert.equal(cmdResponse.events[0].payload, numberCommand.payload)
        })

        it('should validate and write stringCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await Middleware.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
            // console.log('cmdResponse: ', cmdResponse)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 1)
            assert.equal(cmdResponse.events[0].type, stringCommand.type)
            assert.equal(cmdResponse.events[0].payload, stringCommand.payload)
        })

        it('should validate and write objectCommand as an EsEvent with EsEventProperties but return an ITransmuteCommandResponse', async () => {
            let cmdResponse = await Middleware.writeTransmuteCommand(eventStore, web3.eth.accounts[0], objectCommand)
            // console.log('cmdResponse: ', cmdResponse)
            assert.lengthOf(cmdResponse.events, 1)
            assert.lengthOf(cmdResponse.transactions, 9)
            assert.equal(cmdResponse.events[0].type, objectCommand.type)
            assert(_.isEqual(cmdResponse.events[0].payload, objectCommand.payload))
            // assert.equal(cmdResponse.events[0].payload, objectCommand.payload)
        })
    })

    describe('writeTransmuteCommands', () => {
        it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
            let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
            let cmdResponses = await Middleware.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
            // console.log('cmdResponse: ', cmdResponses)
            assert.lengthOf(cmdResponses, commands.length)
            // add more tests here...
        })
    })

    // Please move these tests to EventTypes.spec...
    describe('EventTypes.getEsEventFromEsEventValues', () => {
        let eventIndex
        let txArgs
        before(async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            txArgs = tx.logs[0].args
            eventIndex = tx.logs[0].args.Id.toNumber()
        })

        it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
            let eventValues = await Middleware.readEsEventValues(eventStore, web3.eth.accounts[0], eventIndex)
            let esEvent = EventTypes.getEsEventFromEsEventValues(eventValues)
            // console.log(esEvent)
            assert.equal(esEvent.Type, txArgs.Type)
            assert.equal(web3.isAddress(esEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(esEvent.TxOrigin, txArgs.TxOrigin, "expected TxOrigin to be 0x0...")
        })
    })

    describe('EventTypes.getEsEventPropertyFromEsEventPropertyValues', () => {
        let eventIndex
        let txArgs
        before(async () => {
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            eventIndex = tx.logs[0].args.Id.toNumber()
            addressValueEsEventProperty.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], addressValueEsEventProperty)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
            txArgs = tx.logs[0].args
        })

        it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
            let eventPropVals = await Middleware.readEsEventPropertyValues(eventStore, web3.eth.accounts[0], eventIndex, 0)
            let esEventProperty = EventTypes.getEsEventPropertyFromEsEventPropertyValues(eventPropVals)
            // console.log(esEventProperty)
            // These comparisons are on truffle types
            assert.equal(esEventProperty.Name, txArgs.Name)
            assert.equal(esEventProperty.ValueType, txArgs.ValueType)
            assert.equal(web3.isAddress(esEventProperty.AddressValue), true, "expected AddressValue to be an address")
            assert.equal(esEventProperty.AddressValue, txArgs.AddressValue, "expected AddressValue to be 0x0...")
        })
    })
})
