
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var {
    testAddressValueEvent
} = require('./Mock')

let {
    Type,
    Version,
    ValueType,
    AddressValue,
    UIntValue,
    Bytes32Value,
    StringValue,
    PropertyCount
} = testAddressValueEvent

describe('EventStore.writeEvent', () => {
    beforeEach(async () => {
        eventStore = await EventStore.deployed()
    })
    const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }
    const isVmException = (e) => {
        return e.toString().indexOf('VM Exception while') !== -1
    }
    contract('', (accounts) => {
        it('increases solidityEventCount by 1', async () => {
            let originalCount = (await eventStore.solidityEventCount()).toNumber()
            assert(originalCount === 0)
            let tx = await eventStore.writeEvent(
                Type,
                Version,
                ValueType,
                AddressValue,
                UIntValue,
                Bytes32Value,
                StringValue,
                PropertyCount,
                {
                    from: accounts[0],
                    gas: 2000000
                }
            )
            let newCount = (await eventStore.solidityEventCount()).toNumber()
            assert(newCount === originalCount + 1)
        })
        it('throws an error if called by an unauthorized address', async () => {
            try {
                let tx = await eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, StringValue, PropertyCount, {
                    from: accounts[3],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })
        it('emits a EsEvent, ' + Type + ' of ValueType Address', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[5])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[5])
            let tx = await eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, StringValue, PropertyCount, {
                from: accounts[5],
                gas: 2000000
            })
            let solidityEvent = tx.logs[0].args
            assert.equal(toAscii(solidityEvent.Type), Type, 'expected event to be on type ' + Type)
            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[5], "expected TxOrigin to be accounts[5]")
        })
    })
})

