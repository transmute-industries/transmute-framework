
var Web3 = require('web3')
var EventStore = artifacts.require('./EventStore.sol')

var {
    readSolidityEventAsync,
    writeSolidityEventAsync,
    writeSolidityEventsAsync
} = require('./helpers')

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
                    // console.log(allEvents)
                    return true
                })
        })
    })

    describe.only('writeSolidityEventsAsync', () => {
        it('writes a SOLIDITY_EVENT to the chain', () => {
   
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }

            return EventStore.deployed()
                .then((_esInstance) => {
                    return writeSolidityEventsAsync(_esInstance, _callerMeta, meshPointEvents)
                })
                .then((allEvents) => {
                    console.log(allEvents)
                    return true
                })
        })
    })

    describe('readSolidityEventAsync', () => {
        it('return a SOLIDITY_EVENT at the givent Id', () => {

            return EventStore.deployed()
                .then((_esInstance) => {
                    return readSolidityEventAsync(_esInstance, 0)
                })
                .then((event) => {
                    console.log(event)
                    return true
                })
        })
    })

})
