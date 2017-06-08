var path = require('path')

var TransmuteFramework = require('../../build/TransmuteFramework').default

let { web3, EventStoreContract, EventStoreFactoryContract } = TransmuteFramework.init()

let { getCachedReadModel } = TransmuteFramework.EventStore.ReadModel

// These should be updated to be permissions and default event oriented
var { readModel, reducer } = require('./legacy/reducer')

var _ = require('lodash')

// transmute eventstore create --from 0x23b...
// - create a new event store
const createEventStore = async (fromAddress) => {
    const esf = TransmuteFramework.EventStore.EventStoreFactory
    const factory = await EventStoreFactoryContract.deployed()
    const { tx, events } = await esf.createEventStore(factory, fromAddress)
    const newEsAddress = events[0].AddressValue
    return newEsAddress
}

// transmute eventstore show
// - show the current event store read model
const syncEventStore = async (bindingModel, _callback) =>{
  let { contractAddress, fromAddress } = bindingModel
  let eventStore = await EventStoreContract.at(contractAddress)
  let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
  return updatedReadModel
}

// transmute eventstore write --from 0x23b... --event { type: '...', payload: {...} }
// - write and display a transmute event

const writeEvent = async(bindingModel, _callback) => {
  let { contractAddress, fromAddress,  event } = bindingModel
  event = _.cloneDeep(event)
  let eventStore = await EventStoreContract.at(contractAddress)
  let events = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, fromAddress, event )
  let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
  return updatedReadModel
}

module.exports = {
    createEventStore,
    writeEvent,
    syncEventStore
}

