
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

// need to add event property to mocks ^

describe('EventStore.writeEventProperty', () => {
    beforeEach(async () => {
        eventStore = await EventStore.deployed()
    })
    const toAscii = (value) => {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }
    const isVmException = (e) => {
        return e.toString().indexOf('VM Exception while') !== -1
    }
    contract('',  (accounts) => {
        it('throws an error if called by an unauthorized address', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[5])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[5])
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1, {
                from: accounts[5],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            try {
                let propTx = await eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', '', {
                    from: accounts[3],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })

        it('throws an error if property already exists', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[6])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[6])
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1, {
                from: accounts[6],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let propTx = await eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', '', {
                from: accounts[6],
                gas: 2000000
            })
            try {
                let propTx = await eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue2', '',{
                    from: accounts[6],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })

        it('emit an EsEventProperty', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[7])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[7])
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1, {
                from: accounts[7],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let propTx = await eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', '', {
                from: accounts[7],
                gas: 2000000
            })
            assert(propTx.logs.length === 1)
            assert(propTx.logs[0].event === 'EsEventProperty')
            let solidityEventProp = propTx.logs[0].args
            assert.equal(toAscii(solidityEventProp.ValueType), 'Bytes32', 'expected event prop type to be Bytes32')
            assert.equal(toAscii(solidityEventProp.Bytes32Value), 'CustomValue', 'expected event prop bytes32Value to be CustomValue')
        })
    })
})

