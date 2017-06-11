
var Web3 = require('web3')

var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

describe('', () => {
    let eventStore
    beforeEach(async () => {
        eventStore = await EventStore.deployed()
    })
    const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }
    const isVmException = (e) => {
        return e.toString().indexOf('VM Exception while') !== -1
    }
    contract('EventStore', (accounts) => {
        it('is deployed deployed', () => {
            assert(eventStore)
        })
        describe('creator', async () => {
            it('is the address of the contract creator', async () => {
                let creator = await eventStore.creator()
                assert(creator === accounts[0])
            })
        })
        describe('version', () => {
            it('should return 1', async () => {
                let version = (await eventStore.getVersion()).toNumber()
                assert(version === 1)
            })
        })
        describe('solidityEventCount', async () => {
            it('is initialized to 0', async () => {
                let count = (await eventStore.solidityEventCount()).toNumber()
                assert(count === 0)
            })
        })
    })
})
