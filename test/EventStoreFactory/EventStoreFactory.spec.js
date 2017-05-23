
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')

const { transactionToEventCollection } = require('../EventStore/SolidityEvent/Transactions')

contract('EventStoreFactory', (accounts) => {
    let factory
    let factoryCreatorAddress = accounts[0]
    it('is deployed contract', async () => {
        factory = await EventStoreFactory.deployed()
        return factory
    })

    describe('.createEventStore', () => {
        it('returns an address', async () => {
            let newESAddress = await factory.createEventStore.call({ from: factoryCreatorAddress })
            let isNewESAddressValid = web3.isAddress(newESAddress)
            assert(isNewESAddressValid === true)
        })

        it('creates an event store contract', async () => {
            let tx = await factory.createEventStore({
                from: factoryCreatorAddress,
                gas: 2000000,
            })
            let events = transactionToEventCollection(tx)

            let createdEvent = events[0]
            let auditEvent = events[1]

            assert(createdEvent.Type === 'EVENT_STORE_CREATED')
            assert(auditEvent.Type === 'EVENT_STORE_AUDIT_LOG')
        })
    })

    describe('.getEventStores', async () => {
        it('returns an array of event store contract addresses', async () => {
            let eventStoreContractAddresses = await factory.getEventStores({ from: factoryCreatorAddress })
            assert(eventStoreContractAddresses.length === 1)
        })
    })

    describe('.getEventStoreByCreator', () => {
        it('returns an event store contract by creator address', async () => {
            let eventStoreContractAddress = await factory.getEventStoreByCreator(factoryCreatorAddress, {
                from: factoryCreatorAddress
            })
            let isAddress = web3.isAddress(eventStoreContractAddress)
            assert(isAddress === true)
        })
    })

})
