var Web3 = require('web3')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var {
    readSolidityEventAsync,
    readSolidityEventsAsync,
    writeSolidityEventAsync,
    writeSolidityEventsAsync,
    eventsFromTransaction
} = require('./Middleware')

var {
    meshPointEvent,
    meshPointEvents,
} = require('./mocks')

contract('EventStore', (accounts) => {
})
