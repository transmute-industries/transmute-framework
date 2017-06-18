
var Web3 = require('web3')

var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var { Events } = require('./Mock')

describe('', () => {

    let _eventStore

    beforeEach(async () => {
        _eventStore = await EventStore.deployed()
    })

    function writeEvent({Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue}, options) {
        return _eventStore.writeEvent(Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue, options)
    }

    contract('EventStore', (accounts) => {

        describe('owner', async () => {
            it('is the address of the contract owner', async () => {
                let owner = await _eventStore.owner()
                assert(owner === accounts[0])
            })
        })

        describe('version', () => {
            it('should return 1', async () => {
                let version = (await _eventStore.getVersion()).toNumber()
                assert(version === 1)
            })
        })

        describe('solidityEventCount', async () => {
            it('is initialized to 0', async () => {
                let count = (await _eventStore.solidityEventCount()).toNumber()
                assert(count === 0)
            })

            it('increases by 1 for every event that is written', async () => {
                let originalCount = (await _eventStore.solidityEventCount()).toNumber()
                assert(originalCount === 0)
                let tx = await writeEvent(Events.testUnauthorizedAddressValueEvent, {})
                let newCount = (await _eventStore.solidityEventCount()).toNumber()
                assert(newCount === originalCount + 1)
            })
        })

        describe('getACLAddresses', async () => {
            it('contains nothing when first initialized', async () => {
                let creator = await _eventStore.creator()
                let initialACLAddresses = await _eventStore.getACLAddresses()
                assert(initialACLAddresses.length === 0)
            })

            it('contains a new address after that address requests access', async () => {
                let tx = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', '', false, 'ES', accounts[0])
                let updatedACLAddresses = await _eventStore.getACLAddresses()
                assert(updatedACLAddresses.length === 1)
                assert(updatedACLAddresses[0] === accounts[0])
            })
        })
    })
})
