
var Web3 = require('web3')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')

contract('EventStore', (accounts) => {
    let factory
    it('Factory Instance Exists', () => {
        return EventStoreFactory.deployed().then((_instance) => {
            factory = _instance
        })
    })
})
