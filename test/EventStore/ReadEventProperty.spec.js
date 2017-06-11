
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

describe('EventStore.readEventProperty', () => {
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
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1)
            let solidityEvent = eventTx.logs[0].args
            let lastEventId = solidityEvent.Id.toNumber()
            let propWriteTx = await eventStore.writeEventProperty(lastEventId, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', '')
            try {
                let eventType = await eventStore.readEventProperty.call(lastEventId, 0, {
                    from: accounts[5],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })
        it('emits a EsEventProperty', async () => {
            let reqTX = await eventStore.addRequestorAddress(accounts[3])
            let authTX = await eventStore.authorizeRequestorAddress(accounts[3])
            let eventTx = await eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', '', 1, {
                from: accounts[3],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let lastEventId = solidityEvent.Id.toNumber()
            let propWriteTx = await eventStore.writeEventProperty(lastEventId, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', '', {
                from: accounts[3],
                gas: 2000000
            })
            let returnVals = await eventStore.readEventProperty.call(lastEventId, 0, {
                from: accounts[3]
            })
            let eventId = returnVals[0].toNumber()
            assert.equal(eventId, solidityEvent.Id, 'expected read to match write')
            let propIndex = returnVals[1].toNumber()
            assert.equal(propIndex, 0, 'expected read to match write')
            let propName = toAscii(returnVals[2])
            assert.equal(propName, 'CustomKey', 'expected read to match write')
            let propType = toAscii(returnVals[3])
            assert.equal(propType, 'Bytes32', 'expected read to match write')
            let addressValue = returnVals[4]
            assert.equal(addressValue, 0, 'expected read to match write')
            let uintValue = returnVals[5].toNumber()
            assert.equal(uintValue, 0, 'expected read to match write')
            let bytes32Value = toAscii(returnVals[6])
            assert.equal(bytes32Value, 'CustomValue', 'expected read to match write')
            let stringValue = returnVals[7]
            assert.equal(stringValue, '', 'expected read to match write')
        })
    })
})

