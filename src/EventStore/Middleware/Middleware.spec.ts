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

let eventStore

let testAddressValueEvent: EventTypes.ITransmuteEvent = {
    Type: 'TEST_EVENT',
    Version: 'v0',
    ValueType: 'Address',
    AddressValue: web3.eth.accounts[1],
    UIntValue: 0,
    Bytes32Value: '',
    PropertyCount: 0
}
let {
    Type,
    Version,
    ValueType,
    AddressValue,
    UIntValue,
    Bytes32Value,
    PropertyCount
} = testAddressValueEvent

describe.only('Middleware', () => {

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('readEventWithTruffle', () => {
        it('should return eventValues as truffle types (unusable)', async () => {
            let eventValues = await Middleware.readEventWithTruffle(eventStore, 0, web3.eth.accounts[0])
            // console.log(eventValues)
            assert.equal(eventValues[0].toNumber(), 0)
            assert.lengthOf(eventValues, 10)
           
        })
    })

    describe('EventTypes.getEsEventFromEsEventValues', () => {
        it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
            let eventValues = await Middleware.readEventWithTruffle(eventStore, 0, web3.eth.accounts[0])
            let esEvent = Middleware.EventTypes.getEsEventFromEsEventValues(eventValues)
            // console.log(esEvent)
            assert.equal(esEvent.Type, '0x0000000000000000000000000000000000000000000000000000000000000000')
            assert.equal(web3.isAddress(esEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(esEvent.TxOrigin, '0x0000000000000000000000000000000000000000', "expected TxOrigin to be 0x0...")
            
        })
    })

    describe.only('writeValueTypeEvent', () => {
        it('should write a value event to the chain and emit an EsEvent', async () => {
           let esEvent = await Middleware.writeValueTypeEvent(eventStore, web3.eth.accounts[0], testAddressValueEvent)
           console.log(esEvent)
        })
    })
})
