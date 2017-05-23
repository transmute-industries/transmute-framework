
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

    describe('writeSolidityEventAsync', () => {
        it('writes a SOLIDITY_EVENT to the chain', async () => {
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }
            let _eventStore = await EventStore.deployed()
            let _events = await writeSolidityEventAsync(_eventStore, _callerMeta, meshPointEvent)
            assert.equal(_events[0].Type, meshPointEvent.Type, 'Type is invalid')
            assert.equal(_events[1].StringValue, meshPointEvent.Name, 'Name is invalid')
            assert.equal(_events[2].StringValue, meshPointEvent.LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[3].UIntValue, meshPointEvent.MaxConnections, 'MaxConnections is invalid')
            assert.equal(_events[4].AddressValue, meshPointEvent.CreatorAddress, 'CreatorAddress is invalid')
        })
    })

    describe('writeSolidityEventsAsync', () => {
        it('write an array of SOLIDITY_EVENTs to the chain', async () => {
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }
            let _eventStore = await EventStore.deployed()
            let _events = await writeSolidityEventsAsync(_eventStore, _callerMeta, meshPointEvents)
            assert.equal(_events[0][0].Type, meshPointEvents[0].Type, 'Type is invalid')
            assert.equal(_events[0][1].StringValue, meshPointEvents[0].Name, 'Name is invalid')
            assert.equal(_events[0][2].StringValue, meshPointEvents[0].LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[0][3].UIntValue, meshPointEvents[0].MaxConnections, 'MaxConnections is invalid')
            assert.equal(_events[0][4].AddressValue, meshPointEvents[0].CreatorAddress, 'CreatorAddress is invalid')
            assert.equal(_events[1][0].Type, meshPointEvents[1].Type, 'Type is invalid')
            assert.equal(_events[1][1].StringValue, meshPointEvents[1].Name, 'Name is invalid')
            assert.equal(_events[1][2].StringValue, meshPointEvents[1].LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[1][3].AddressValue, meshPointEvents[1].CreatorAddress, 'CreatorAddress is invalid')
        })
    })

    describe('readSolidityEventAsync', () => {
        it('return a SOLIDITY_EVENT at the given Id', async () => {
            let _eventStore = await EventStore.deployed()
            let _event = await readSolidityEventAsync(_eventStore, 0)
            assert.equal(_event.Type, meshPointEvent.Type, 'Type is invalid')
            assert.equal(_event.Name, meshPointEvent.Name, 'Name is invalid')
            assert.equal(_event.LocationPointer, meshPointEvent.LocationPointer, 'LocationPointer is invalid')
            assert.equal(_event.MaxConnections, meshPointEvent.MaxConnections, 'MaxConnections is invalid')
            assert.equal(_event.CreatorAddress, meshPointEvent.CreatorAddress, 'CreatorAddress is invalid')
        })
    })

    describe('readSolidityEventsAsync', () => {
        it('return all SOLIDITY_EVENTs as array from the given eventId to the latest event', async () => {
            let _eventStore = await EventStore.deployed()
            let _events = await readSolidityEventsAsync(_eventStore, 0)
            assert.equal(_events[0].Type, meshPointEvent.Type, 'Type is invalid')
            assert.equal(_events[0].Name, meshPointEvent.Name, 'Name is invalid')
            assert.equal(_events[0].LocationPointer, meshPointEvent.LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[0].MaxConnections, meshPointEvent.MaxConnections, 'MaxConnections is invalid')
            assert.equal(_events[0].CreatorAddress, meshPointEvent.CreatorAddress, 'CreatorAddress is invalid')
            assert.equal(_events[1].Type, meshPointEvents[0].Type, 'Type is invalid')
            assert.equal(_events[1].Name, meshPointEvents[0].Name, 'Name is invalid')
            assert.equal(_events[1].LocationPointer, meshPointEvents[0].LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[1].MaxConnections, meshPointEvents[0].MaxConnections, 'MaxConnections is invalid')
            assert.equal(_events[1].CreatorAddress, meshPointEvents[0].CreatorAddress, 'CreatorAddress is invalid')
            assert.equal(_events[2].Type, meshPointEvents[1].Type, 'Type is invalid')
            assert.equal(_events[2].Name, meshPointEvents[1].Name, 'Name is invalid')
            assert.equal(_events[2].LocationPointer, meshPointEvents[1].LocationPointer, 'LocationPointer is invalid')
            assert.equal(_events[2].MaxConnections, meshPointEvents[1].MaxConnections, 'MaxConnections is invalid')
            assert.equal(_events[2].CreatorAddress, meshPointEvents[1].CreatorAddress, 'CreatorAddress is invalid')
        })
    })
})
