
var Web3 = require('web3')

var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

var { Events } = require('./Mock')

var { toAscii, isVmException } = require('./Common')

describe('EventStore.readEvent', () => {

    beforeEach(async () => {
        _eventStore = await EventStore.deployed()
    })

    function writeEvent({Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue}, options) {
        return _eventStore.writeEvent(Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue, options)
    }

    contract('EventStore', (accounts) => {

        contract('readEvent', async (accounts) => {
            it('throws an error if called by an unauthorized ACLAddress and event is authorized', async () => {
                let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
                let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', 'ES_WRITE_GRANTED', false, 'ES', accounts[1])
                let eventTx = await writeEvent(Events.testAuthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})
                let solidityEvent = eventTx.logs[0].args
                try {
                    let eventType = await _eventStore.readEvent.call(solidityEvent.Id, {
                        from: accounts[1]
                    })
                } catch (e) {
                    assert.equal(isVmException(e), true, "expected an unauthorized read to cause a vm exception")
                }
            })

            it('emits a EsEvent if called by an unauthorized ACLAddress and event is unauthorized', async () => {
                let eventTx = await writeEvent(Events.testUnauthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})
                let solidityEvent = eventTx.logs[0].args
                let returnVals = await _eventStore.readEvent.call(solidityEvent.Id, {
                    from: accounts[1]
                })

                let eventId = returnVals[0].toNumber()
                assert.equal(eventId, solidityEvent.Id, 'expected read to match write')

                let eventType = toAscii(returnVals[1])
                assert.equal(eventType, toAscii(solidityEvent.Type), 'expected read to match write')

                let eventVersion = toAscii(returnVals[2])
                assert.equal(eventVersion, toAscii(solidityEvent.Version), 'expected read to match write')

                let valueType = toAscii(returnVals[3])
                assert.equal(valueType, toAscii(solidityEvent.ValueType), 'expected read to match write')

                let isAuthorized = returnVals[4]
                assert.equal(isAuthorized, solidityEvent.IsAuthorized, 'expected read to match write')

                let permissionDomain = returnVals[5]
                assert.equal(permissionDomain, solidityEvent.PermissionDomain, 'expected read to match write')

                let addressValue = returnVals[6]
                assert.equal(addressValue, solidityEvent.AddressValue, 'expected read to match write')

                let uintValue = returnVals[7].toNumber()
                assert.equal(uintValue, solidityEvent.UIntValue.toNumber(), 'expected read to match write')

                let bytes32Value = toAscii(returnVals[8])
                assert.equal(bytes32Value, toAscii(solidityEvent.Bytes32Value), 'expected read to match write')

                let stringValue = toAscii(returnVals[9])
                assert.equal(stringValue, toAscii(solidityEvent.StringValue), 'expected read to match write')

                let txOrigin = returnVals[10]
                assert.equal(txOrigin, solidityEvent.TxOrigin, 'expected read to match write')

                let created = returnVals[11].toNumber()
                assert.equal(created, solidityEvent.Created.toNumber(), 'expected read to match write')
            })

            it('emits a EsEvent if called by an authorized ACLAddress and event is authorized', async () => {
                let grantTX = await _eventStore.grantReadAccess('ES_READ_GRANTED', true, 'ES', accounts[1])
                let eventTx = await writeEvent(Events.testAuthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})
                let solidityEvent = eventTx.logs[0].args
                let returnVals = await _eventStore.readEvent.call(solidityEvent.Id, {
                    from: accounts[1]
                })

                let eventId = returnVals[0].toNumber()
                assert.equal(eventId, solidityEvent.Id, 'expected read to match write')

                let eventType = toAscii(returnVals[1])
                assert.equal(eventType, toAscii(solidityEvent.Type), 'expected read to match write')

                let eventVersion = toAscii(returnVals[2])
                assert.equal(eventVersion, toAscii(solidityEvent.Version), 'expected read to match write')

                let valueType = toAscii(returnVals[3])
                assert.equal(valueType, toAscii(solidityEvent.ValueType), 'expected read to match write')

                let isAuthorized = returnVals[4]
                assert.equal(isAuthorized, solidityEvent.IsAuthorized, 'expected read to match write')

                let permissionDomain = returnVals[5]
                assert.equal(permissionDomain, solidityEvent.PermissionDomain, 'expected read to match write')

                let addressValue = returnVals[6]
                assert.equal(addressValue, solidityEvent.AddressValue, 'expected read to match write')

                let uintValue = returnVals[7].toNumber()
                assert.equal(uintValue, solidityEvent.UIntValue.toNumber(), 'expected read to match write')

                let bytes32Value = toAscii(returnVals[8])
                assert.equal(bytes32Value, toAscii(solidityEvent.Bytes32Value), 'expected read to match write')

                let stringValue = toAscii(returnVals[9])
                assert.equal(stringValue, toAscii(solidityEvent.StringValue), 'expected read to match write')

                let txOrigin = returnVals[10]
                assert.equal(txOrigin, solidityEvent.TxOrigin, 'expected read to match write')

                let created = returnVals[11].toNumber()
                assert.equal(created, solidityEvent.Created.toNumber(), 'expected read to match write')
            })
        })
    })
})
