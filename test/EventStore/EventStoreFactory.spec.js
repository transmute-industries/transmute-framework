var Web3 = require('web3')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/EventStoreFactory.sol')
var EventStore = artifacts.require('./TransmuteFramework/EventStore/EventStore.sol')

var _ = require('lodash')

const { marshalEvent, unMarshalEvent } = require('../Common')

describe('', () => {

  contract('EventStoreFactory', function (accounts) {

    var factory = null
    var account1EventStoreAddresses = []
    var account2EventStoreAddresses = []
    var eventStoreAddresses = []

    it('deployed', async () => {
      factory = await EventStoreFactory.deployed()
      let owner = await factory.owner()
      assert(owner === accounts[0])
    })

    it('createEventStore.call', async () => {
      let firstEventStoreAddress = await factory.createEventStore.call({ from: accounts[0] })
      let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
      let event = _tx.logs[0].args
      let unMarshalledEvent = unMarshalEvent(
          event.Meta, 
          event.Type, 
          event.Data
      )
      assert.equal(unMarshalledEvent.meta, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
      assert.equal(unMarshalledEvent.data, firstEventStoreAddress, 'expected es contract address to match call')

      eventStoreAddresses.push(unMarshalledEvent.data)
      account1EventStoreAddresses.push(unMarshalledEvent.data)
    })

    it('createEventStore', async () => {
      // Create firstEventStore
      let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
      let event = _tx.logs[0].args
      let unMarshalledEvent = unMarshalEvent(
          event.Meta, 
          event.Type, 
          event.Data
      )
      assert.equal(unMarshalledEvent.meta, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
      // assert.equal(data, firstEventStoreAddress, 'expected es contract address to match call')
      let escAddresss = unMarshalledEvent.data
      let esc = await EventStore.at(escAddresss)
      let escOwner = await esc.creator()
      assert.equal(escOwner, accounts[0], 'expect factory caller to be es contract owner.')

      eventStoreAddresses.push(unMarshalledEvent.data)
      account1EventStoreAddresses.push(unMarshalledEvent.data)

      // Create secondEventStore
      // _tx = await factory.createEventStore({ from: accounts[2], gas: 2000000 })
      // event = _tx.logs[0].args
      // meta = toAscii(event.Meta)
      // data = typedDataFromBytes32Event(event)
      // assert.equal(meta, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
      // // assert.equal(data, secondEventStoreAddress, 'expected es contract address to match call')
      // escAddresss = data
      // esc = await EventStore.at(escAddresss)
      // escOwner = await esc.creator()
      // assert.equal(escOwner, accounts[2], 'expect factory caller to be es contract owner.')

      // eventStoreAddresses.push(data)
      // account2EventStoreAddresses.push(data)

    })

    // it('getEventStores', async () => {
    //   let _addresses = await factory.getEventStores()
    //   assert(_.difference(eventStoreAddresses, _addresses).length === 0, 'Expect eventStoreAddresses to equal _addresses')
    // })

    // it('getEventStoresByCreator', async () => {
    //   let _account1EventStoreAddresses = await factory.getEventStoresByCreator.call({ from: accounts[1] })
    //   assert(_.difference(_account1EventStoreAddresses, account1EventStoreAddresses).length === 0, 'Expect _account1EventStoreAddresses to equal account1EventStoreAddresses')

    //   let _account2EventStoreAddresses = await factory.getEventStoresByCreator.call({ from: accounts[2] })
    //   assert(_.difference(_account2EventStoreAddresses, account2EventStoreAddresses).length === 0, 'Expect _account2EventStoreAddresses to equal account2EventStoreAddresses')

    // })

    // it('killEventStore', async () => {
    //   // Address 0 is the deployer of the factory, and the only one who can destroy stores with it.
    //   let _tx = await factory.killEventStore(account1EventStoreAddresses[0], { from: accounts[1] })
    //   event = _tx.logs[0].args
    //   meta = toAscii(event.Meta)
    //   data = typedDataFromBytes32Event(event)
    //   assert.equal(data, account1EventStoreAddresses[0], 'Expect the destroyed address in event to match the method call')
    // })

    // it('getEventStores', async () => {
    //   let _addresses = await factory.getEventStores()
    //   assert(!_.includes(_addresses, account1EventStoreAddresses[0]), 'Expect killed store to not be in factory list')
    //   assert(_.includes(_addresses, account1EventStoreAddresses[1]), 'Expect non killed store to be in list')
    // })
  })
})

