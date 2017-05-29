var Web3 = require('web3')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var _ = require('lodash')

contract('EventStoreFactory', function (accounts) {

  var factory = null
  var firstEventStoreAddress = null
  var secondEventStoreAddress = null
  var eventStoreCreator = accounts[0]

  it('deployed', () => {
      return EventStoreFactory.deployed().then((_instance) => {
          factory = _instance
      })
  })

  it('createEventStore.call', (done) => {
    factory.createEventStore.call({ from: eventStoreCreator }).then((_address) => {
      firstEventStoreAddress = _address
      done()
    })
    it('Create EventStore', async () => {
      let _tx = await factory.createEventStore({ from: eventStoreCreator, gas: 2000000 })
      let event = _tx.logs[0].args
      // console.log(event)

      let eventType = toAscii(event.Type)
      assert.equal(eventType, 'FACTORY_EVENT_STORE_CREATED', 'expect first event to be Type FACTORY_EVENT_STORE_CREATED')

      let eventId = event.Id.toNumber()
      assert.equal(eventId, 1, 'expect FACTORY_EVENT_STORE_CREATED  event to have Id 1, EVENT_STORE_CREATED to have Id 0')

      // Add owner / creator tests here...
      // let creatorAddress = event.Id.toNumber()
    })

  })

  it('createEventStore', async () => {
    let _tx = await factory.createEventStore({ from: eventStoreCreator, gas: 2000000 })
    // let _events = eventsFromTransaction(_tx)
    // assert.equal(_events[0].Type, 'FACTORY_EVENT_STORE_CREATED', 'EventStore Created Event is invalid')
    // assert.equal(_events[1].AddressValue, firstEventStoreAddress, 'EventStore ContractAddress is invalid')
    // assert.equal(_events[2].AddressValue, eventStoreCreator, 'EventStore ContractOwnerAddress is invalid')
  })

  it('createEventStore.call', (done) => {
    factory.createEventStore.call({ from: eventStoreCreator }).then((_address) => {
      secondEventStoreAddress = _address
      done()
    })
  })

  it('createEventStore', async () => {
    let _tx = await factory.createEventStore({ from: eventStoreCreator, gas: 2000000 })
    // let _events = eventsFromTransaction(_tx)
    // assert.equal(_events[0].Type, 'FACTORY_EVENT_STORE_CREATED', 'EventStore Created Event is invalid')
    // assert.equal(_events[1].AddressValue, secondEventStoreAddress, 'EventStore ContractAddress is invalid')
    // assert.equal(_events[2].AddressValue, eventStoreCreator, 'EventStore ContractOwnerAddress is invalid')
  })

  it('getEventStores', async () => {
    let _addresses = await factory.getEventStores()
    assert(_.includes(_addresses, firstEventStoreAddress), 'EventStoreFactory addresses does not contain firstEventStoreAddress')
    assert(_.includes(_addresses, secondEventStoreAddress), 'EventStoreFactory addresses does not contain secondEventStoreAddress')
  })

  it('owner', async () => {
    let _eventStore = await EventStore.at(firstEventStoreAddress)
    let _owner = await _eventStore.owner.call()
    assert.equal(_owner, factory.address, 'EventStoreFactory is not EventStore owner')
  })

  it('getEventStoresByCreator', async () => {
    let _eventStoreAddresses = await factory.getEventStoresByCreator.call({ from: eventStoreCreator })
    assert(_.includes(_eventStoreAddresses, firstEventStoreAddress), 'creatorEventStoreMapping addresses does not contain firstEventStoreAddress')
    assert(_.includes(_eventStoreAddresses, secondEventStoreAddress), 'creatorEventStoreMapping addresses does not contain secondEventStoreAddress')
  })

  it('killEventStore', async () => {
    let _tx = await factory.killEventStore(firstEventStoreAddress, { from: eventStoreCreator })
    // let _events = eventsFromTransaction(_tx)
    // assert.equal(_events[0].Type, 'FACTORY_EVENT_STORE_DESTROYED', 'EventStore Destroyed Event is invalid')
    // assert.equal(_events[1].AddressValue, firstEventStoreAddress, 'EventStore ContractAddress is invalid')
  })

  it('getEventStores', async () => {
    let _addresses = await factory.getEventStores()
    assert(!_.includes(_addresses, firstEventStoreAddress), 'EventStoreFactory addresses contains firstEventStoreAddress')
    assert(_.includes(_addresses, secondEventStoreAddress), 'EventStoreFactory addresses does not contain secondEventStoreAddress')
  })
})
