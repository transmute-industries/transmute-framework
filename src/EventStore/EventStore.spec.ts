'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()
import { EventTypes } from './EventTypes/EventTypes'

import { isFSA } from 'flux-standard-action'
import * as _ from 'lodash'
const contract = require('truffle-contract')

import { assert, expect, should } from 'chai'

import events from './Mock/Demo/Healthcare/events'
import { reducer, readModel } from './Mock/Demo/Healthcare/reducer'

var fs = require('fs')

const writeReadModelToFile = (readModel) => {
  fs.writeFile('./temp/' + readModel.readModelType + ".ReadModel.json", JSON.stringify(readModel), function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

const compareReadModels = (current, next) => {
  var diff = _.omitBy(current, function (v, k) {
    console.log('k,v,last[k] = ' + k + ',' + v + ',' + next[k]);
    return next[k] === v;
  });
  console.log('diff=' + JSON.stringify(diff));
}

import {
  addressValueEsEvent,
  bytes32ValueEsEvent,
  uIntValueEsEvent,

  addressCommand,
  numberCommand,
  stringCommand,
  objectCommand,
  ipfsObjectCommand

} from './Mock/Events/TestEvents'

describe('EventStore', () => {

  let eventStore

  before(async () => {
    eventStore = await EventStoreContract.deployed()
  })

  describe('.writeEsEvent', () => {
    it('should return a tx containing an EsEvent in logs', async () => {
      let tx = await TransmuteFramework.EventStore.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
      assert.lengthOf(tx.logs, 1)
      assert.equal(tx.logs[0].event, 'EsEvent')
    })
  })

  // Then add tests for reading

  describe('.readEsEventValues', () => {
    before(async () => {
      let tx = await TransmuteFramework.EventStore.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
      assert.lengthOf(tx.logs, 1)
      assert.equal(tx.logs[0].event, 'EsEvent')
    })

    it('should return eventValues as truffle types (unusable)', async () => {
      let eventValues = await TransmuteFramework.EventStore.readEsEventValues(eventStore, web3.eth.accounts[0], 0)
      assert.equal(eventValues[0].toNumber(), 0)
      assert.lengthOf(eventValues, 12)

    })
  })

  describe('.readTransmuteEvent', () => {
    it('read address value event should return an FSA with event store meta', async () => {
      let tx = await TransmuteFramework.EventStore.writeEsEvent(eventStore, web3.eth.accounts[0], addressValueEsEvent)
      let eventIndex = tx.logs[0].args.Id.toNumber()
      let txArgs = tx.logs[0].args
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
      assert.equal(transmuteEvent.payload, txArgs.AddressValue, 'expected payload to match address value in transaction event log')
      assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
    })

    it('read uint value event should return an FSA with event store meta', async () => {
      let tx = await TransmuteFramework.EventStore.writeEsEvent(eventStore, web3.eth.accounts[0], uIntValueEsEvent)
      let eventIndex = tx.logs[0].args.Id.toNumber()
      let txArgs = tx.logs[0].args
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
      assert.equal(transmuteEvent.payload, txArgs.UIntValue.toNumber(), 'expected payload to match uintValue.toNumber() from transaction event log')
      assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
    })

    it('read bytes32 value event should return an FSA with event store meta', async () => {
      let tx = await TransmuteFramework.EventStore.writeEsEvent(eventStore, web3.eth.accounts[0], bytes32ValueEsEvent)
      let eventIndex = tx.logs[0].args.Id.toNumber()
      let txArgs = tx.logs[0].args
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, EventTypes.toAscii(txArgs.Type), 'expected type to match transaction event log')
      assert.equal(transmuteEvent.payload, EventTypes.toAscii(txArgs.Bytes32Value), 'expected payload to match ascii(bytes32Value) in transaction event log')
      assert.equal(transmuteEvent.meta.id, eventIndex, 'expected eventId to be eventIndex')
    })
  })

  // command types and event types should be different... smells... not great...
  describe('.writeTransmuteCommand', () => {

    it('should validate and write addressCommand as an EsEvent but return an ITransmuteEvent', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, addressCommand.type)
      assert.equal(cmdResponse.events[0].payload, addressCommand.payload)
    })

    it('should validate and write numberCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, numberCommand.type)
      assert.equal(cmdResponse.events[0].payload, numberCommand.payload)
    })

    it('should validate and write stringCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, stringCommand.type)
      assert.equal(cmdResponse.events[0].payload, stringCommand.payload)
    })

    it('should validate and write ipfsObjectCommand as an EsEvent with EsEventProperties but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], ipfsObjectCommand)
      // console.log(cmdResponse.events[0])
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, ipfsObjectCommand.type)
      assert(_.isEqual(cmdResponse.events[0].payload, ipfsObjectCommand.payload))
    })
  })

  describe('.writeTransmuteCommands', () => {
    it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
      let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
      let cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
      assert.lengthOf(cmdResponses, commands.length)
      // add more tests here...
    })
  })


  describe(".readModelGenerator", () => {
    it("should return the initial read model when passed an empty array", () => {
      // This will usually be overidden by the consumer
      readModel.contractAddress = '0x0000000000000000000000000000000000000000'
      let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [])
      assert(_.isEqual(readModel, updatedReadModel), 'expected no changes from application of empty event array')
    })

    it("should return an updated read model when passed a non-empty event array", () => {
      let registerEvent = <any>events[0]
      let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [registerEvent])
      assert.equal(updatedReadModel.lastEvent, 0, 'expected event 0 to have been applied to the read model')
      assert.equal(
        updatedReadModel.model.patient[registerEvent.payload.patientId].patientName,
        registerEvent.payload.patientName,
        'expected patient to be registered'
      )
    })

    it("should handle multiple events fine", () => {
      let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, events)
      // add some tests here maybe... but really just look at the file in temp
      // writeReadModelToFile(updatedReadModel)
    })
  })


  describe(".maybeSyncReadModel", () => {
    let eventStore
    let updatedReadModel: EventTypes.IReadModel
    before(async () => {
      eventStore = await EventStoreContract.deployed()
      let firstEvent = <any>_.omit(events[0], 'meta')
      let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], firstEvent)
      // console.log('txWithEvents: ', txWithEvents)
      let newEvents = txWithEvents.events
      readModel.contractAddress = eventStore.address
      readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
      updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, newEvents)
      // console.log(updatedReadModel)
    })

    it("should return the same read model if it is up to date", async () => {
      let maybeUpdatedReadModel: EventTypes.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
      assert(_.isEqual(maybeUpdatedReadModel, updatedReadModel), 'expected no changes when no new events have been saved')
    })

    it("should return an updated read model when new events have been saved", async () => {
      let secondEvent = <any>_.omit(events[1], 'meta')
      let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], secondEvent)
      let maybeUpdatedReadModel: EventTypes.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
      // compareReadModels(updatedReadModel, maybeUpdatedReadModel)
      assert.equal(maybeUpdatedReadModel.lastEvent, updatedReadModel.lastEvent + 1, 'expected 1 more event to have been applied')
    })
  })


  before(async () => {
    eventStore = await EventStoreContract.deployed()
    readModel.contractAddress = eventStore.address
    readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
  })

  describe('.writeTransmuteCommand', () => {
    it('should validate and write addressCommand as an EsEvent but return an ITransmuteEvent', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, addressCommand.type)
      assert.equal(cmdResponse.events[0].payload, addressCommand.payload)
    })

    it('should validate and write numberCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, numberCommand.type)
      assert.equal(cmdResponse.events[0].payload, numberCommand.payload)
    })

    it('should validate and write stringCommand as an EsEvent but return an ITransmuteCommandResponse', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
      assert.lengthOf(cmdResponse.events, 1)
      assert.lengthOf(cmdResponse.transactions, 1)
      assert.equal(cmdResponse.events[0].type, stringCommand.type)
    })
  })

  describe('.writeTransmuteCommands', () => {
    it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
      let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
      let cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
      assert.lengthOf(cmdResponses, commands.length)
      // add more tests here...
    })
  })

  describe('.readTransmuteEvent', () => {
    it('read address value event should return an FSA with event store meta', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], addressCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('read number value event should return an FSA with event store meta', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], numberCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('read string value event should return an FSA with event store meta', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], stringCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })

    it('write an objectCommand and then read it', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], ipfsObjectCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      // console.log('cmdResponse: ', cmdResponse.events[0].meta.path)
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
      assert.equal(transmuteEvent.meta.path, 'ipfs/Qmf4GZbciiPLMTZYLpM88GB2CpopCJszdwybUnnwswkpKE', 'expected meta.has to be command payload')
    })

    it('read object value event should return an FSA with event store meta', async () => {
      let cmdResponse = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], objectCommand)
      let eventIndex = cmdResponse.events[0].meta.id
      let transmuteEvent = await TransmuteFramework.EventStore.readTransmuteEvent(eventStore, web3.eth.accounts[0], eventIndex)
      assert.equal(isFSA(transmuteEvent), true)
      assert.equal(transmuteEvent.type, cmdResponse.events[0].type, 'expected type to match command response built from event log')
    })
  })

  describe('.readTransmuteEvents', () => {
    let initialEventId, commands, cmdResponses
    before(async () => {
      initialEventId = (await eventStore.solidityEventCount()).toNumber()
      commands = [addressCommand, numberCommand, stringCommand, objectCommand]
      cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
      assert.lengthOf(cmdResponses, commands.length)
    })
    it('should return all transmute events after and including the given eventId', async () => {
      let transmuteEvents = await TransmuteFramework.EventStore.readTransmuteEvents(eventStore, web3.eth.accounts[0], initialEventId)
      assert.lengthOf(transmuteEvents, commands.length)
      // Add more tests here...
    })
  })
})
