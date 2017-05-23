var Web3 = require('web3')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')
var { eventsFromTransaction } = require('../EventStore/SolidityEvent/Transactions')
var _ = require('lodash')

contract('EventStoreFactory', function (accounts) {

  var factory = null
  var eventStoreAddress = null
  var eventStoreCreator = accounts[0]
  var faucetRecipient = accounts[1]
  var faucetCustomer = accounts[2]
  var faucetName = 'austin-test-faucet'

  it('Factory Instance Exists', () => {
      return EventStoreFactory.deployed().then((_instance) => {
          factory = _instance
      })
  })

  it('Create EventStore address', (done) => {
    factory.createEventStore.call({ from: eventStoreCreator }).then((_address) => {
      eventStoreAddress = _address
      done()
    })
  })

  it('Create EventStore', async () => {
    let _tx = await factory.createEventStore({ from: eventStoreCreator, gas: 2000000 })
    let _events = eventsFromTransaction(_tx)
    assert.equal(_events[0].Type, 'EVENT_STORE_CREATED', 'EventStore Created Event is invalid')
    assert.equal(_events[1].AddressValue, eventStoreAddress, 'EventStore ContractAddress is invalid')
    assert.equal(_events[2].AddressValue, eventStoreCreator, 'EventStore ContractOwnerAddress is invalid')
  })

  it('Verify EventStore address contained in EventStoreFactory addresses', async () => {
    let _addresses = await factory.getEventStores()
    assert(_.includes(_addresses, eventStoreAddress), 'EventStoreFactory addresses does not contain eventStoreAddress')
  })

  it('Verify EventStore owner', async () => {
    let _eventStore = await EventStore.at(eventStoreAddress)
    let _owner = await _eventStore.owner.call()
    assert.equal(_owner, factory.address, 'EventStoreFactory is not EventStore owner')
  })

  it('Verify creatorEventStoreMapping update', async () => {
    let _eventStoreAddress = await factory.getEventStoreByCreator.call({ from: eventStoreCreator })
    assert.equal(_eventStoreAddress, eventStoreAddress, 'Address for creatorEventStoreMapping for not match EventStore address')
  })

  it('Destroy EventStore', async () => {
    let _tx = await factory.killEventStore(eventStoreAddress, { from: eventStoreCreator })
    let _events = eventsFromTransaction(_tx)
    assert.equal(_events[0].Type, 'EVENT_STORE_DESTROYED', 'EventStore Destroyed Event is invalid')
    assert.equal(_events[1].AddressValue, eventStoreAddress, 'EventStore ContractAddress is invalid')
  })
})
