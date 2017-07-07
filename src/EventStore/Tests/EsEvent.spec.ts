'use strict'

import TransmuteFramework from '../../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()

import { assert, expect, should } from 'chai'

import {
  addressValueEsEvent,
  // bytes32ValueEsEvent, NEED TEST HERE
  // uIntValueEsEvent, NEED TEST HERE
} from '../Mock/Events/TestEvents'

describe('EventStore EsEvents', () => {

  let eventStore

  before(async () => {
    eventStore = await EventStoreContract.deployed()
  })

  describe('.writeUnmarshalledEsCommand', () => {
    it('should return a tx containing an EsEvent in logs', async () => {
      let tx = await TransmuteFramework.EventStore.writeUnmarshalledEsCommand(eventStore, web3.eth.accounts[0], addressValueEsEvent)
      assert.lengthOf(tx.logs, 1)
      assert.equal(tx.logs[0].event, 'EsEvent')
    })
  })

  // Then add tests for reading

  describe('.readEsEventValues', () => {
    before(async () => {
      let tx = await TransmuteFramework.EventStore.writeUnmarshalledEsCommand(eventStore, web3.eth.accounts[0], addressValueEsEvent)
      assert.lengthOf(tx.logs, 1)
      assert.equal(tx.logs[0].event, 'EsEvent')
    })

    it('should return eventValues as truffle types (unusable)', async () => {
      let eventValues = await TransmuteFramework.EventStore.readEsEventValues(eventStore, web3.eth.accounts[0], 0)
      assert.equal(eventValues[0].toNumber(), 0)
      assert.lengthOf(eventValues, 12)

    })
  })

  
})
