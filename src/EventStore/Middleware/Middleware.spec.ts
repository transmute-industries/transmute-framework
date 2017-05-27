'use strict'

import { assert, expect, should } from 'chai'
import { web3 } from '../../env'

import { EventStore } from '../EventStore'
import { Middleware } from './Middleware'


const eventStoreArtifacts = require('../../../build/contracts/EventStore')
const contract = require('truffle-contract')
export const EventStoreContract = contract(eventStoreArtifacts)
EventStoreContract.setProvider(web3.currentProvider)

let eventStore

describe.only('Middleware', () => {

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('readEventWithTruffle', () => {
        it('should return eventValues as truffle types (unusable)', async () => {
            let eventValues = await Middleware.readEventWithTruffle(eventStore, 0, web3.eth.accounts[0])
            assert.equal(eventValues[0].toNumber(), 0)
            assert.lengthOf(eventValues, 10)
            // console.log(eventValues)
        })
    })

    describe('eventValuesToEventObject', () => {
        it('should convert unusable truffle event values to nice transmute events', async () => {
            let eventValues = await Middleware.readEventWithTruffle(eventStore, 0, web3.eth.accounts[0])
            // assert.equal(eventValues[0].toNumber(), 0)
            // assert.lengthOf(eventValues, 10)
            let event = Middleware.eventValuesToEventObject(eventValues)
            console.log(event)
        })
    })

    

})
