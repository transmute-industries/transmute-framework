"use strict";
const moment = require('moment')
const contract = require('truffle-contract')

import { expect, assert, should } from 'chai'

import { web3 } from '../../env'

import {
  JSON_SCHEMA,
} from '../Mock/data'

import { Middleware } from '../Middleware/Middleware'
import { EventTypes } from './EventTypes'

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


describe("EventTypes", () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('.getEsEventFromEsEventValues', () => {
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

    describe('.getEsEventPropertyFromEsEventPropertyValues', () => {
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


    describe(".flatten", () => {
        it("should return the flat object, ready to be many EsEventProperties", () => {
            let flatObj: any = EventTypes.flatten(JSON_SCHEMA.Person)
            expect(flatObj.title == JSON_SCHEMA.Person.title)
            expect(flatObj['properties.age.description'] == JSON_SCHEMA.Person.properties.age.description)
        })
    })

    describe(".unflatten", () => {
        it("should return a fat object, ready to be a payload", () => {
            let flatObj = EventTypes.flatten(JSON_SCHEMA.Person)
            let fatObj: any = EventTypes.unflatten(flatObj)
            expect(fatObj.title == JSON_SCHEMA.Person.title)
            expect(fatObj.properties.age.description == JSON_SCHEMA.Person.properties.age.description)
        })
    })

});
