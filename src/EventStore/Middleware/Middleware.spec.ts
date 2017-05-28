'use strict'

import { assert, expect, should } from 'chai'
import { web3 } from '../../env'

import { EventStore } from '../EventStore'
import { Middleware } from './Middleware'
import { EventTypes } from '../EventTypes/EventTypes'

const eventStoreArtifacts = require('../../../build/contracts/EventStore')
const contract = require('truffle-contract')
export const EventStoreContract = contract(eventStoreArtifacts)
EventStoreContract.setProvider(web3.currentProvider)

import { 
    addressValueEsEvent, 
    bytes32ValueEsEvent,
    uIntValueEsEvent,
    esEventProp,


    numberCommand,
    // stringCommand,
    // addressCommand

} from '../Mock/Events/TestEvents'

import { isFSA } from 'flux-standard-action'

describe.only('Middleware', () => {

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
            esEventProp.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], esEventProp)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
            let eventFromPropTx = tx.logs[0].args
            assert.equal(EventTypes.toAscii(eventFromPropTx.ValueType), esEventProp.ValueType)
            // console.log(eventFromPropTx)
        })
    })

    // Then add tests for reading 
 
    describe('readEsEventValues', () => {
        before(async ()=>{
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
        before(async ()=>{
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            txArgs = tx.logs[0].args
            eventIndex = tx.logs[0].args.Id.toNumber()
            esEventProp.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], esEventProp)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
        })

        it('should return eventValues as truffle types (unusable)', async () => {
            let eventPropVals = await Middleware.readEsEventPropertyValues(eventStore, web3.eth.accounts[0], eventIndex, 0)
            // console.log(eventPropVals)
            // These comparisons are not on truffle types
            assert.equal(eventPropVals[0].toNumber(), eventIndex)
            assert.equal(eventPropVals[1].toNumber(), 0)
            assert.equal(EventTypes.toAscii(eventPropVals[2]), esEventProp.Name)
            assert.equal(EventTypes.toAscii(eventPropVals[3]), esEventProp.ValueType)
            assert.equal(eventPropVals[4], esEventProp.AddressValue)
            assert.equal(eventPropVals[5].toNumber(), esEventProp.UIntValue)
            assert.equal(EventTypes.toAscii(eventPropVals[6]), esEventProp.Bytes32Value)
            // assert.lengthOf(eventPropVals, 10)
           
        })
    })

    describe('EventTypes.getEsEventFromEsEventValues', () => {

        let eventIndex
        let txArgs
        before(async ()=>{
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            txArgs = tx.logs[0].args
            eventIndex = tx.logs[0].args.Id.toNumber()
        })

        it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
            let eventValues = await Middleware.readEsEventValues(eventStore, web3.eth.accounts[0], eventIndex )
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
        before(async ()=>{
            let tx = await Middleware.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEvent')
            eventIndex = tx.logs[0].args.Id.toNumber()
            esEventProp.EventIndex = eventIndex
            tx = await Middleware.writeEsEventProperty(eventStore, web3.eth.accounts[0], esEventProp)
            assert.lengthOf(tx.logs, 1)
            assert.equal(tx.logs[0].event, 'EsEventProperty')
            txArgs = tx.logs[0].args
        })

        it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
            let eventPropVals = await Middleware.readEsEventPropertyValues(eventStore, web3.eth.accounts[0], eventIndex, 0 )
            let esEventProperty = EventTypes.getEsEventPropertyFromEsEventPropertyValues(eventPropVals)
            // console.log(esEventProperty)
            // These comparisons are on truffle types
            assert.equal(esEventProperty.Name, txArgs.Name)
            assert.equal(esEventProperty.ValueType, txArgs.ValueType)
            assert.equal(web3.isAddress(esEventProperty.AddressValue), true, "expected AddressValue to be an address")
            assert.equal(esEventProperty.AddressValue, txArgs.AddressValue, "expected AddressValue to be 0x0...")
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

     describe.only('writeTransmuteCommand', () => {
        it('should validate and write numberCommand as an EsEvent but return an ITransmuteEvent', async () => {
            let txWithTransmuteEvent = await Middleware.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
            console.log('result: ', txWithTransmuteEvent)
        })
    })


    // describe.only('writeObjectTypeEvent', () => {
    //     it('should return a tx containing an EsEvent in logs', async () => {
    //         let tx = await Middleware.writeObjectTypeEvent(eventStore, web3.eth.accounts[0], testAddressValueEvent)
    //         assert.lengthOf(tx.logs, 1)
    //         assert.equal(tx.logs[0].event, 'EsEvent')
    //         //console.log(tx)
    //     })
    // })
   // Then add tests for reading and writing TransmuteEvents (objects without silly EsEvent Keys...)

})
