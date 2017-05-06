'use strict'

import { web3 } from '../env'
import { assert } from 'chai'

import { EventStore } from './EventStore'
import { Persistence } from './Persistence'
import { ReadModel } from './ReadModel'
import { Constants } from './constants'
import { initialProjectState, projectReducer } from './reducer'

const transmuteTestEvent = {
  Id: 0,
  Type: Constants.PROJECT_CREATED,
  AddressValue: web3.eth.accounts[0],
  UIntValue: 1,
  StringValue: 'Coral'
}

const transmuteTestEventStream = [
  {
    Id: 1,
    Type: Constants.PROJECT_JOINED,
    AddressValue: web3.eth.accounts[0],
    UIntValue: 1,
    StringValue: 'Engineer Alice'
  },
  {
    Id: 2,
    Type: Constants.PROJECT_JOINED,
    AddressValue: web3.eth.accounts[1],
    UIntValue: 1,
    StringValue: 'Customer Bob'
  },
  {
    Id: 3,
    Type: Constants.PROJECT_MILESTONE,
    AddressValue: web3.eth.accounts[0],
    UIntValue: 1,
    StringValue: 'Version 0'
  }
]

const expectedProjectState = {
  Id: '0',
  Name: 'Coral',
  Users: ['Engineer Alice', 'Customer Bob'],
  Milestones: ['Version 0']
}

let es, startEventCount, maybeUpdatedReadModel

describe('EventStore', () => {

  before(async () => {
    // console.log(TF)
    es = await EventStore.ES.deployed()
    startEventCount = (await es.eventCount()).toNumber()
  })

  describe('.writeEvent', () => {
    it('should return the event at the index', async () => {
      let transmuteEvents = await EventStore.writeEvent(es, transmuteTestEvent, web3.eth.accounts[0])
      assert.equal(transmuteEvents.length, 1)
      assert.equal(transmuteEvents[0].Type, transmuteTestEvent.Type)
      assert.equal(transmuteEvents[0].AddressValue, transmuteTestEvent.AddressValue)
      assert.equal(transmuteEvents[0].UIntValue, transmuteTestEvent.UIntValue)
      assert.equal(transmuteEvents[0].StringValue, transmuteTestEvent.StringValue)
    })
  })

  describe('.readEvent', () => {
    it('should return the event at the index', async () => {
      let transmuteEvent = await EventStore.readEvent(es, 0)
      assert.equal(transmuteEvent.Type, transmuteTestEvent.Type)
      assert.equal(transmuteEvent.AddressValue, transmuteTestEvent.AddressValue)
      assert.equal(transmuteEvent.UIntValue, transmuteTestEvent.UIntValue)
      assert.equal(transmuteEvent.StringValue, transmuteTestEvent.StringValue)
    })
  })

  describe('.writeEvents', () => {
    it('should return the events written to the event store', async () => {
      let transmuteEvents = await EventStore.writeEvents(es, transmuteTestEventStream, web3.eth.accounts[0])
      assert.equal(transmuteEvents.length, 3)
      // console.log(transmuteEvents)
    })
  })

  describe('.readEvents', () => {
    it('should return the events in the contract starting with the index', async () => {
      let transmuteEvents = await EventStore.readEvents(es, startEventCount)
      assert.equal(transmuteEvents.length, 4)
      // console.log(transmuteEvents)
    })
  })

  describe('.setItem', () => {
    it('should return the value when passed a valid key, after saving the value', async () => {
      Persistence.setItem(initialProjectState.Id, initialProjectState)
        .then((readModel) => {
          assert.equal(initialProjectState.Id, readModel.Id)
          assert.equal(initialProjectState.Name, readModel.Name)
        })
    })
  })

  describe('.getItem', () => {
    it('should return null for invalid key', async () => {
      Persistence.getItem('not-a-real-key')
        .then((readModel) => {
          assert.isNull(readModel)
        })
    })

    it('should return a readModel when passed valid readModelKey', async () => {
      Persistence.getItem(initialProjectState.Id)
        .then((readModel) => {
          assert.equal(initialProjectState.Id, readModel.Id)
          assert.equal(initialProjectState.Name, readModel.Name)
        })
    })
  })

  describe('.readModelGenerator', () => {
    it('should return the the initial reducer state when no events exist', async () => {
      let projectModel = ReadModel.readModelGenerator(initialProjectState, projectReducer, [])
      assert.equal(projectModel.Id, initialProjectState.Id)
      assert.equal(projectModel.EventCount, initialProjectState.EventCount)
      assert.equal(projectModel.Users, initialProjectState.Users)
      assert.equal(projectModel.Milestones, initialProjectState.Milestones)
    })

    it('should return the updated read model when passed events', async () => {
      let projectHistory = await EventStore.readEvents(es, startEventCount)
      let projectModel = ReadModel.readModelGenerator(initialProjectState, projectReducer, projectHistory)
      assert.equal(projectModel.Id, expectedProjectState.Id)
      assert.equal(projectModel.Name, expectedProjectState.Name)
      assert.isArray(projectModel.Users, expectedProjectState.Users)
      assert.isArray(projectModel.Milestones, expectedProjectState.Milestones)
    })
  })

  describe('maybeSyncReadModel', () => {
    it('should retrieve a read model and sync any missing events from the contract', async () => {
      let _maybeUpdatedReadModel = await ReadModel.maybeSyncReadModel(es, initialProjectState, projectReducer)
      maybeUpdatedReadModel = _maybeUpdatedReadModel
    })

    it('should return quickly if no new events exist', async () => {
      let sameReadModel = await ReadModel.maybeSyncReadModel(es, maybeUpdatedReadModel, projectReducer)
      assert.equal(sameReadModel.Name, maybeUpdatedReadModel.Name)
      assert.equal(sameReadModel.EventCount, maybeUpdatedReadModel.EventCount)
    })
  })

})
