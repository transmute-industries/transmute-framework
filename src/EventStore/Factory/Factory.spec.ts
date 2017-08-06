'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreFactoryContract, Factory } = TransmuteFramework.init()

import { expect, assert } from 'chai'

import * as _ from 'lodash'

describe('Factory', () => {

    let factory, account_addresses, account, fromAddress

    before(async () => {
        factory = await EventStoreFactoryContract.deployed()
        account_addresses = await TransmuteFramework.getAccounts();
        account = account_addresses[0];
        fromAddress = account;
    })

    describe('.getFactoryReadModel', () => {
        it('return the current state of a factory', async () => {
            let state = await Factory.getFactoryReadModel(factory, fromAddress)
            // console.log(state)
            // Add tests here...
        })
    })

    describe('.createEventStore...', () => {
        it('returns a transaction', async () => {
            let { tx, events } = await Factory.createEventStore(factory, fromAddress)
            // console.log(events)
            expect(tx.tx !== undefined)
        })

        it('returns a ES_CREATED event', async () => {
            let { tx, events } = await Factory.createEventStore(factory, fromAddress)
            expect(events[0].type === 'ES_CREATED')
        })
    })
    describe('.getAllEventStoreContractAddresses...', () => {
        it('should create an event store and return event ', async () => {
            let addresses = await Factory.getAllEventStoreContractAddresses(factory, fromAddress)
        })
    })

    describe('.setAddressRole', () => {
        it('owner can make account 1 an admin', async () => {
            // console.log(factory.setAddressRole)
            let { tx, events } = await Factory.setAddressRole(factory, fromAddress, account_addresses[1], 'admin')
            assert.equal(events[0].type, 'AC_ROLE_ASSIGNED', 'expect AC_ROLE_ASSIGNED event')
            assert.equal(events[0].payload[account_addresses[1]], 'admin', 'expect account1 to be assigned admin')
            // TODO: add more tests here...
        })
    })

    describe('.setGrant', () => {
        it('owner can grant admin role create:any eventstore', async () => {
            // console.log(factory.setAddressRole)
            let { tx, events } = await Factory.setGrant(factory, fromAddress, 'admin', 'eventstore', 'create:any', ['*'])
            // console.log(events)
            assert.equal(events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')
            // TODO: add more tests here...
        })
    })

    describe('.canRoleActionResource', () => {
        it('owner can check if role is granted action on resource', async () => {
            // console.log(factory.setAddressRole)
            let granted = await Factory.canRoleActionResource(factory, fromAddress, 'admin', 'create:any', 'eventstore')
            // console.log(granted)
            assert(granted, 'expect admin can create any event store')
            // assert.equal(events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')
            // TODO: add more tests here...
        })
    })

})
