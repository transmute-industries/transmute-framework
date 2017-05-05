'use strict'

import { web3 } from '../env'
import { assert } from 'chai'

import {
  EventStore,
  writeEvent,
  writeEvents,
  readEvent,
  readEvents,
  getItem,
  setItem,
  readModelGenerator,
  maybeSyncReadModel
} from './EventStore'

import {
  event,
  eventStream,
  initialProjectState,
  expectedProjectState,
  projectReducer
} from './EventStore.mock'

let es, startEventCount, maybeUpdatedReadModel

describe('EventStore', () => {

  before(async () => {
    // console.log(TF)
    es = await EventStore.deployed()
    startEventCount = (await es.eventCount()).toNumber()

  })

  describe('.writeEvent', () => {
    it('should return the event at the index', async () => {
      let events = await writeEvent(es, event, web3.eth.accounts[0])
      assert.equal(events.length, 1)
      assert.equal(events[0].Type, event.Type)
      assert.equal(events[0].AddressValue, event.AddressValue)
      assert.equal(events[0].UIntValue, event.UIntValue)
      assert.equal(events[0].StringValue, event.StringValue)
    })
  })

  describe('.readEvent', () => {
    it('should return the event at the index', async () => {
      let event = await readEvent(es, 0)
      assert.equal(event.Type, event.Type)
      assert.equal(event.AddressValue, event.AddressValue)
      assert.equal(event.UIntValue, event.UIntValue)
      assert.equal(event.StringValue, event.StringValue)
    })
  })

  describe('.writeEvents', () => {
    it('should return the events written to the event store', async () => {
      let events = await writeEvents(es, eventStream, web3.eth.accounts[0])
      assert.equal(events.length, 3)
      // console.log(events)
    })
  })

  describe('.readEvents', () => {
    it('should return the events in the contract starting with the index', async () => {
      let events = await readEvents(es, startEventCount)
      assert.equal(events.length, 4)
      // console.log(events)
    })
  })

  describe('.setItem', () => {
    it('should return the value when passed a valid key, after saving the value', async () => {
      setItem(initialProjectState.Id, initialProjectState)
        .then((readModel) => {
          assert.equal(initialProjectState.Id, readModel.Id)
          assert.equal(initialProjectState.Name, readModel.Name)
        })
    })
  })

  describe('.getItem', () => {
    it('should return null for invalid key', async () => {
      getItem('not-a-real-key')
        .then((readModel) => {
          assert.isNull(readModel)
        })
    })

    it('should return a readModel when passed valid readModelKey', async () => {
      getItem(initialProjectState.Id)
        .then((readModel) => {
          assert.equal(initialProjectState.Id, readModel.Id)
          assert.equal(initialProjectState.Name, readModel.Name)
        })
    })
  })

  describe('.readModelGenerator', () => {
    it('should return the the initial reducer state when no events exist', async () => {
      let projectModel = readModelGenerator(initialProjectState, projectReducer, [])
      assert.equal(projectModel.Id, initialProjectState.Id)
      assert.equal(projectModel.EventCount, initialProjectState.EventCount)
      assert.equal(projectModel.Users, initialProjectState.Users)
      assert.equal(projectModel.Milestones, initialProjectState.Milestones)
    })

    it('should return the updated read model when passed events', async () => {
      let projectHistory = await readEvents(es, startEventCount)
      let projectModel = readModelGenerator(initialProjectState, projectReducer, projectHistory)
      assert.equal(projectModel.Id, expectedProjectState.Id)
      assert.equal(projectModel.Name, expectedProjectState.Name)
      assert.isArray(projectModel.Users, expectedProjectState.Users)
      assert.isArray(projectModel.Milestones, expectedProjectState.Milestones)
    })
  })

  describe('maybeSyncReadModel', () => {
    it('should retrieve a read model and sync any missing events from the contract', async () => {
      let _maybeUpdatedReadModel = await maybeSyncReadModel(es, initialProjectState, projectReducer)
      maybeUpdatedReadModel = _maybeUpdatedReadModel
    })

    it('should return quickly if no new events exist', async () => {
      let sameReadModel = await maybeSyncReadModel(es, maybeUpdatedReadModel, projectReducer)
      assert.equal(sameReadModel.Name, maybeUpdatedReadModel.Name)
      assert.equal(sameReadModel.EventCount, maybeUpdatedReadModel.EventCount)
    })
  })

})


