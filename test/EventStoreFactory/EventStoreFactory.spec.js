var Web3 = require('web3')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var _ = require('lodash')

contract('EventStoreFactory', function (accounts) {

  var factory = null
  var eventStoreAddress = null
  var eventStoreCreator = accounts[0]

  function toAscii(value) {
    return web3.toAscii(value).replace(/\u0000/g, '')
  }

  function isVmException(e) {
    return e.toString().indexOf('VM Exception while') !== -1
  }

  it('Factory Instance Exists', () => {
    return EventStoreFactory.deployed().then((_instance) => {
      factory = _instance
    })
  })

  describe('createEventStore', () => {
    it('Create EventStore address', (done) => {
      factory.createEventStore.call({ from: eventStoreCreator }).then((_address) => {
        eventStoreAddress = _address
        done()
      })
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

  describe('getEventStores', () => {
    it('Verify EventStore address contained in EventStoreFactory addresses', async () => {
      let _addresses = await factory.getEventStores()
      assert(_.includes(_addresses, eventStoreAddress), 'EventStoreFactory addresses does not contain eventStoreAddress')
    })
  })

  describe('owner', () => {
    it('Verify EventStore owner', async () => {
      let _eventStore = await EventStore.at(eventStoreAddress)
      let _owner = await _eventStore.owner.call()
      assert.equal(_owner, factory.address, 'EventStoreFactory is not EventStore owner')
    })
  })

  describe('killEventStore', () => {
    it('Destroy EventStore', async () => {
      let _tx = await factory.killEventStore(eventStoreAddress, { from: eventStoreCreator })
      // console.log(_tx)
      let event = _tx.logs[0].args
      let eventType = toAscii(event.Type)
      assert.equal(eventType, 'FACTORY_EVENT_STORE_DESTROYED', 'expect first event to be Type FACTORY_EVENT_STORE_DESTROYED')
    })
  })

})
