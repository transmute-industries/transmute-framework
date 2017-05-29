'use strict'

const contract = require('truffle-contract')

import * as _ from 'lodash'
import { isFSA } from 'flux-standard-action'
import { expect, assert, should } from 'chai'
import { web3 } from '../env'
import { EventStore } from './EventStore'

const eventStoreArtifacts = require('../../build/contracts/EventStore')

import events from './Mock/Demo/Healthcare/events'
import { reducer, readModel } from './Mock/Demo/Healthcare/reducer'

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

} from './Mock/Events/TestEvents'

export const EventStoreContract = contract(eventStoreArtifacts)
EventStoreContract.setProvider(web3.currentProvider)

describe('EventStore', () => {

  let eventStore

  before(async () => {
    eventStore = await EventStoreContract.deployed()
    readModel.contractAddress = eventStore.address
    readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
  })

  describe('.writeTransmuteCommand', () => {
    it('should validate and write addressCommand as an EsEvent but return an ITransmuteEvent', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
      // console.log('cmdResponse: ', cmdResponse)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, addressCommand.type)
      assert.equal(cmdResponse.events[0].payload, addressCommand.payload)
    })

    it('should validate and write numberCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
      // console.log('cmdResponse: ', cmdResponse)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, numberCommand.type)
      assert.equal(cmdResponse.events[0].payload, numberCommand.payload)
    })

    it('should validate and write stringCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
      // console.log('cmdResponse: ', cmdResponse)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, stringCommand.type)
      assert.equal(cmdResponse.events[0].payload, stringCommand.payload)
    })

    it('should validate and write objectCommand as an EsEvent with EsEventProperties but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], objectCommand)
      // console.log('cmdResponse: ', cmdResponse)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 9)
      assert.equal(cmdResponse.events[0].type, objectCommand.type)
      assert(_.isEqual(cmdResponse.events[0].payload, objectCommand.payload))
      // assert.equal(cmdResponse.events[0].payload, objectCommand.payload)
    })
  })

  describe('.writeTransmuteCommands', () => {
    it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
      let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
      let cmdResponses = await EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
      // console.log('cmdResponse: ', cmdResponses)
      assert.lengthOf(cmdResponses, commands.length)
      // add more tests here...
    })
  })

  describe('.readTransmuteEvent', () => {
    it('read address value event should return an FSA with event store meta', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('read number value event should return an FSA with event store meta', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('read string value event should return an FSA with event store meta', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('read object value event should return an FSA with event store meta', async () => {
      let cmdResponse = await EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], objectCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

  })

  describe('.readTransmuteEvents', () => {
    let initialEventId, commands, cmdResponses
    before(async () => {
      initialEventId = (await eventStore.solidityEventCount()).toNumber()
      commands = [addressCommand, numberCommand, stringCommand, objectCommand]
      cmdResponses = await EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
      // console.log('cmdResponse: ', cmdResponses)
      assert.lengthOf(cmdResponses, commands.length)
    })
    it('should return all transmute events after and including the given eventId', async () => {
      let transmuteEvents = await EventStore.readTransmuteEvents(eventStore, web3.eth.accounts[0], initialEventId)
      assert.lengthOf(transmuteEvents, commands.length)
      // Add more tests here...
    })
  })

})
