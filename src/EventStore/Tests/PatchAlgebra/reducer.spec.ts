'use strict'

import TransmuteFramework from '../../../TransmuteFramework'

const { web3, EventStoreContract, EventStore } = TransmuteFramework.init()

import { EventTypes } from '../../../EventStore/EventTypes/EventTypes'

import { assert, expect, should } from 'chai'


import * as _ from 'lodash'
const contract = require('truffle-contract')

import events from './events'
import { reducer, readModel } from './reducer'


describe('Patch Alegbra', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('Write States as IPLD Patches', () => {
        it('should convert state change events to state patch commands and save them as IPLD to IPFS', async () => {

            let updatedReadModel = readModel

            for (var i = 0; i < events.length; i++) {
                let command = Object.assign({}, events[i], {
                    payload: TransmuteFramework.TransmuteIpfs.diff(updatedReadModel.model, events[i].payload)
                })
                let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], command)
                updatedReadModel = await TransmuteFramework.EventStore.getCachedReadModel(
                    eventStore.address,
                    eventStore,
                    web3.eth.accounts[0],
                    readModel,
                    reducer
                )
            }

            let model = <any>updatedReadModel.model
            assert(model.hero.health === 30)
        })
    })

})
