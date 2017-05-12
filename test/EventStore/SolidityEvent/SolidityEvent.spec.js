
var Web3 = require('web3')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var {
    readSolidityEventAsync,
    readSolidityEventsAsync,
    writeSolidityEventAsync,
    writeSolidityEventsAsync
} = require('./Middleware')

var {
    meshPointEvent,
    meshPointEvents,
} = require('./mocks')



contract('EventStore', (accounts) => {

    describe('writeSolidityEventAsync', () => {
        it('writes a SOLIDITY_EVENT to the chain', () => {
            let event = meshPointEvent
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }
            return EventStore.deployed()
                .then((_esInstance) => {
                    return writeSolidityEventAsync(_esInstance, _callerMeta, event)
                })
                .then((allEvents) => {
                    // ADD TESTS HERE TO CONFIRM EVENT BEHAVIOR
                    // console.log(allEvents)
                    return true
                })
        })
    })

    describe('writeSolidityEventsAsync', () => {
        it('write an array of SOLIDITY_EVENTs to the chain', () => {
   
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }

            return EventStore.deployed()
                .then((_esInstance) => {
                    return writeSolidityEventsAsync(_esInstance, _callerMeta, meshPointEvents)
                })
                .then((allEvents) => {
                    // ADD TESTS HERE TO CONFIRM EVENT BEHAVIOR
                    // console.log(allEvents)
                    return true
                })
        })
    })

    describe('readSolidityEventAsync', () => {
        it('return a SOLIDITY_EVENT at the given Id', () => {

            return EventStore.deployed()
                .then((_esInstance) => {
                    return readSolidityEventAsync(_esInstance, 0)
                })
                .then((event) => {
                    // ADD TESTS HERE TO CONFIRM EVENT BEHAVIOR
                    // console.log(event)
                    return true
                })
        })
    })


    describe('readSolidityEventsAsync', () => {
        it('return all SOLIDITY_EVENTs as array from the gievent eventId to the latest event', () => {

            return EventStore.deployed()
                .then((_esInstance) => {
                    return readSolidityEventsAsync(_esInstance, 0)
                })
                .then((event) => {
                    // ADD TESTS HERE TO CONFIRM EVENT BEHAVIOR
                    // console.log(event)
                    return true
                })
        })
    })

})
