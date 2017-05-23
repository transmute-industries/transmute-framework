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
    assert.equal(_events[0].Type, 'EVENT_STORE_CREATED', 'EventStore Created Event invalid')
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

  //
  // it('Verify Customer Can Request Access', (done) => {
  //   var events = factory.AccessRequested()
  //
  //   events.watch((error, result) => {
  //     if (error == null) {
  //       assert.equal(faucetCustomer, result.args.requestorAddress, 'Customer did not request access')
  //       events.stopWatching()
  //       done()
  //     }
  //   })
  //
  //   factory
  //   .requestAccess(eventStoreAddress, faucetCustomer, {
  //     from: faucetCustomer,
  //     gas: 2000000
  //   })
  // })
  //
  // it('Verify Customer address contained in Faucet requestorAddresses', () => {
  //   Faucet.at(eventStoreAddress).then((_faucet) => {
  //     return _faucet.getRequestorAddresses.call()
  //   }).then((_requestorAddresses) => {
  //     assert(_.includes(_requestorAddresses, faucetCustomer), '_requestorAddresses does not contain faucetCustomer')
  //   })
  // })
  //
  // it('Verify Recipient Cannot Authorize Access', (done) => {
  //   factory
  //   .authorizeAccess(eventStoreAddress, faucetCustomer, {
  //     from: faucetRecipient,
  //     gas: 2000000
  //   }).then((tx) => {
  //     console.log('tx:', tx)
  //     done()
  //   }).catch((error) => {
  //     validateError(error)
  //     done()
  //   })
  // })
  //
  // it('Verify Creator Can Authorize Access', (done) => {
  //   var events = factory.AuthorizationGranted()
  //
  //   events.watch((error, result) => {
  //     if (error == null) {
  //       assert.equal(faucetCustomer, result.args.requestorAddress, 'Creator did not authorize access')
  //       events.stopWatching()
  //       done()
  //     }
  //   })
  //
  //   factory
  //   .authorizeAccess(eventStoreAddress, faucetCustomer, {
  //     from: eventStoreCreator,
  //     gas: 2000000
  //   })
  // })
  //
  // it('Verify Customer address is authorized', (done) => {
  //   Faucet.at(eventStoreAddress).then((_faucet) => {
  //     return _faucet.isAddressAuthorized.call(faucetCustomer)
  //   }).then((_isAuthorized) => {
  //     assert(_isAuthorized, 'faucetCustomer is not authorized')
  //     done()
  //   })
  // })
  //
  // it('Verify Customer Can Get Wei', (done) => {
  //   Faucet.at(eventStoreAddress).then((_faucet) => {
  //     var events = _faucet.EtherRequested()
  //
  //     events.watch((error, result) => {
  //       if (error == null) {
  //         _faucet.isAddressAuthorized.call(faucetCustomer)
  //         .then((_isAuthorized) => {
  //           assert(_isAuthorized, 'faucetCustomer is not authorized')
  //           done()
  //         })
  //         assert.equal(1000000000000000000, result.args.sentAmount.toNumber(), 'Amount sent was not equal to 1000000000000000000')
  //         events.stopWatching()
  //       }
  //     })
  //
  //     _faucet.getWei({ from: faucetCustomer, gas: 2000000 })
  //   })
  // })
  //
  // it('Verify Customer Can Send Wei', (done) => {
  //   Faucet.at(eventStoreAddress).then((_faucet) => {
  //     var events = _faucet.EtherSent()
  //
  //     events.watch((error, result) => {
  //       if (error == null) {
  //         assert.equal(faucetCustomer, result.args.toAddress, 'faucetCustomer was not sent wei')
  //         events.stopWatching()
  //         done()
  //       }
  //     })
  //
  //     _faucet.sendWei(faucetRecipient, { from: faucetCustomer })
  //   })
  // })
  //
  // it('Verify Creator Can Revoke Access', (done) => {
  //   var events = factory.AuthorizationRevoked()
  //
  //   events.watch((error, result) => {
  //     if (error == null) {
  //       assert.equal(faucetCustomer, result.args.requestorAddress, 'Creator did not revoke access')
  //       events.stopWatching()
  //       done()
  //     }
  //   })
  //
  //   factory
  //   .revokeAccess(eventStoreAddress, faucetCustomer, {
  //     from: eventStoreCreator,
  //     gas: 2000000
  //   })
  // })
  //
  // it('Verify Customer address is not authorized', (done) => {
  //   Faucet.at(eventStoreAddress).then((_faucet) => {
  //     return _faucet.isAddressAuthorized.call(faucetCustomer)
  //   }).then((_isAuthorized) => {
  //     assert(!_isAuthorized, 'faucetCustomer is authorized')
  //     done()
  //   })
  // })
  //
  // describe('EventStore', () => {
  //
  //   it('is currently version 1', () => {
  //     return Faucet.at(eventStoreAddress)
  //     .then((_esInstance) => {
  //       return _esInstance.getVersion();
  //     })
  //     .then((versionBigNum) => {
  //       let version = versionBigNum.toNumber();
  //       assert(version === 1)
  //     })
  //   })
  //
  //   it('readEvent', () => {
  //     return Faucet.at(eventStoreAddress)
  //     .then((_faucet) => {
  //       return readEvent(_faucet, 0)
  //     })
  //     .then((eventObject) => {
  //       // console.log('eventObject: ', eventObject);
  //       assert.equal(eventObject.Type, 'FAUCET_ADDRESS_ACCESS_REQUESTED');
  //       assert.equal(eventObject.AddressValue, faucetCustomer);
  //       assert.equal(eventObject.UIntValue, 1);
  //       assert.equal(eventObject.StringValue, '');
  //     })
  //   })
  //
  //   it('readEvents', () => {
  //     return Faucet.at(eventStoreAddress)
  //     .then((_faucet) => {
  //       return readEvents(_faucet)
  //     })
  //     .then((eventObjects) => {
  //       // console.log('eventObject: ', eventObjects);
  //       assert.equal(eventObjects.length, 3);
  //       assert.equal(eventObjects[0].Id, 0);
  //       assert.equal(eventObjects[1].Id, 1);
  //       assert.equal(eventObjects[2].Id, 2);
  //     })
  //   })
  // })
})
