

var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

describe('EventStore Permissions', () => {
    beforeEach(async () => {
        eventStore = await EventStore.deployed()
    })
    const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }
    const isVmException = (e) => {
        return e.toString().indexOf('VM Exception while') !== -1
    }
    contract('getRequestorAddresses', (accounts) => {
        it('contains only the creator when first initialized', async () => {
            let creator = await eventStore.creator()
            let initialRequestorAddresses = await eventStore.getRequestorAddresses()
            assert(initialRequestorAddresses.length === 1)
            assert(initialRequestorAddresses[0] === creator)
        })
        it('contains a new address after that address requests access', async () => {
            let initialRequestorAddresses = await eventStore.getRequestorAddresses()
            assert(initialRequestorAddresses.length === 1)
            let tx = await eventStore.addRequestorAddress(accounts[1])
            let updatedRequestorAddresses = await eventStore.getRequestorAddresses()
            assert(updatedRequestorAddresses.length === 2)
            assert(updatedRequestorAddresses[1] === accounts[1])
        })
    })
    contract('addRequestorAddress', (accounts) => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_REQUESTED of ValueType Address', async () => {
            let tx = await eventStore.addRequestorAddress(accounts[2], {
                from: accounts[0],
                gas: 2000000
            })
            assert(tx.logs.length === 1)
            assert(tx.logs[0].event === 'EsEvent')
            let solidityEvent = tx.logs[0].args
            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_REQUESTED', 'expected event to be on type EVENT_STORE_ACCESS_REQUESTED')
            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")
            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[2], "expected AddressValue to be accounts[2]")
        })
        it('adds a requestor address to the requestorAddress AddressSet', async () => {
            let initialRequestorAddresses = await eventStore.getRequestorAddresses()
            assert.equal(initialRequestorAddresses.length, 2, 'expected 2 addreses at this point')
            let tx = await eventStore.addRequestorAddress(accounts[3])
            let updatedRequestorAddresses = await eventStore.getRequestorAddresses()
            assert.equal(updatedRequestorAddresses.length, 3)
            assert.equal(updatedRequestorAddresses[2], accounts[3])
        })
    })
    contract('authorizeRequestorAddress', (accounts) => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_GRANTED of ValueType Address', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[5])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[5])
            assert(authTX.logs.length === 1)
            assert(authTX.logs[0].event === 'EsEvent')
            let solidityEvent = authTX.logs[0].args
            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_GRANTED', 'expected event to be on type EVENT_STORE_ACCESS_GRANTED')
            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")
            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[5], "expected AddressValue to be accounts[5]")
        })
    })
    contract('isAddressAuthorized', (accounts) => {
        it('returns true for addresses that have been authorized', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[5])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[5])
            let isAddress5Authorized = await eventStore.isAddressAuthorized(accounts[5])
            assert.equal(isAddress5Authorized, true, "expected address 5 to be authorized]")
        })
    })
    contract('revokeRequestorAddress', (accounts) => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_REVOKED of ValueType Address', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[5])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[5])
            let revokeTX = await eventStore.revokeRequestorAddress(accounts[5])
            assert(revokeTX.logs.length === 1)
            assert(revokeTX.logs[0].event === 'EsEvent')
            let solidityEvent = revokeTX.logs[0].args
            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_REVOKED', 'expected event to be on type EVENT_STORE_ACCESS_REVOKED')
            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")
            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[5], "expected AddressValue to be accounts[5]")
        })
    })
})
