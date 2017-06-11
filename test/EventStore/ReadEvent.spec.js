
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

describe('EventStore.readEvent', () => {
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
         it('throws an error if called by an unauthorized address', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[2])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[2])
            let eventTx = await eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, StringValue, PropertyCount, {
                from: accounts[2],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            try {
                let eventType = await eventStore.readEvent.call(solidityEvent.Id, {
                    from: accounts[4],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })
        it('emits a EsEvent', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[3])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[3])
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1, {
                from: accounts[3],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let returnVals = await eventStore.readEvent.call(solidityEvent.Id, {
                from: accounts[3]
            })
            let eventId = returnVals[0].toNumber()
            assert.equal(eventId, solidityEvent.Id, 'expected read to match write')
            let eventType = toAscii(returnVals[1])
            assert.equal(eventType, toAscii(solidityEvent.Type), 'expected read to match write')
            let eventVersion = toAscii(returnVals[2])
            assert.equal(eventVersion, toAscii(solidityEvent.Version), 'expected read to match write')
            let valueType = toAscii(returnVals[3])
            assert.equal(valueType, toAscii(solidityEvent.ValueType), 'expected read to match write')
            let addressValue = returnVals[4]
            assert.equal(addressValue, solidityEvent.AddressValue, 'expected read to match write')
            let uintValue = returnVals[5].toNumber()
            assert.equal(uintValue, solidityEvent.UIntValue.toNumber(), 'expected read to match write')
            let bytes32Value = toAscii(returnVals[6])
            assert.equal(bytes32Value, toAscii(solidityEvent.Bytes32Value), 'expected read to match write')
            let stringValue = returnVals[7]
            assert.equal(stringValue, '', 'expected read to match write')
            let txOrigin = returnVals[8]
            assert.equal(txOrigin, solidityEvent.TxOrigin, 'expected read to match write')
            let created = returnVals[9].toNumber()
            assert.equal(created, solidityEvent.Created.toNumber(), 'expected read to match write')
            let propCount = returnVals[10].toNumber()
            assert.equal(propCount, solidityEvent.PropertyCount.toNumber(), 'expected read to match write')
        })
    })
})

