
var Web3 = require('web3')
var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

contract('EventStore', (accounts) => {

    let testAddressValueEvent = {
        Type: 'TEST_EVENT',
        Version: 'v0',
        ValueType: 'Address',
        AddressValue: accounts[1],
        UIntValue: 0,
        Bytes32Value: '',
        PropertyCount: 0
    }
    let {
        Type,
        Version,
        ValueType,
        AddressValue,
        UIntValue,
        Bytes32Value,
        PropertyCount
    } = testAddressValueEvent

    function toAscii(value) {
        return web3.toAscii(value).replace(/\u0000/g, '')
    }

    function isVmException(e) {
        return e.toString().indexOf('VM Exception while') !== -1
    }

    let _eventStore

    beforeEach(async () => {
        _eventStore = await EventStore.deployed()
    })

    contract('getVersion', async () => {
        it('should return 1', async () => {
            let version = (await _eventStore.getVersion()).toNumber()
            assert(version === 1)
        })
    })

    contract('solidityEventCount', async () => {
        it('is initialized to 0', async () => {
            let count = (await _eventStore.solidityEventCount()).toNumber()
            // console.log(count)
            assert(count === 0)
        })
        it('increases by 1 for every event that is written', async () => {
            let originalCount = (await _eventStore.solidityEventCount()).toNumber()
            // console.log(count)
            assert(originalCount === 0)
            let tx = await _eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, PropertyCount)
            // console.log(tx)
            let newCount = (await _eventStore.solidityEventCount()).toNumber()
            assert(newCount === originalCount + 1)
        })
    })

    contract('creator', async () => {
        it('is the address of the contract creator', async () => {
            let creator = await _eventStore.creator()
            // console.log(creator)
            assert(creator === accounts[0])
        })
    })

    contract('getRequestorAddresses', async () => {
        it('contains only the creator when first initialized', async () => {
            let creator = await _eventStore.creator()
            let initialRequestorAddresses = await _eventStore.getRequestorAddresses()
            // console.log(initialRequestorAddresses)
            assert(initialRequestorAddresses.length === 1)
            assert(initialRequestorAddresses[0] === creator)
        })

        it('contains a new address after that address requests access', async () => {
            let initialRequestorAddresses = await _eventStore.getRequestorAddresses()
            assert(initialRequestorAddresses.length === 1)
            let tx = await _eventStore.addRequestorAddress(accounts[1])
            // console.log(tx)
            let updatedRequestorAddresses = await _eventStore.getRequestorAddresses()
            assert(updatedRequestorAddresses.length === 2)
            assert(updatedRequestorAddresses[1] === accounts[1])
            // console.log(updatedRequestorAddresses)
        })
    })

    contract('addRequestorAddress', async () => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_REQUESTED of ValueType Address', async () => {
            let tx = await _eventStore.addRequestorAddress(accounts[2])
            // console.log(tx)
            assert(tx.logs.length === 1)
            assert(tx.logs[0].event === 'EsEvent')
            let solidityEvent = tx.logs[0].args

            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_REQUESTED', 'expected event to be on type EVENT_STORE_ACCESS_REQUESTED')

            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[2], "expected AddressValue to be accounts[2]")
            // console.log( solidityEvent ) 
        })

        it('adds a requestor address to the requestorAddress AddressSet', async () => {
            let initialRequestorAddresses = await _eventStore.getRequestorAddresses()
            // console.log(initialRequestorAddresses)
            assert.equal(initialRequestorAddresses.length, 2, 'expected 2 addreses at this point')
            let tx = await _eventStore.addRequestorAddress(accounts[3])
            // console.log(tx)
            let updatedRequestorAddresses = await _eventStore.getRequestorAddresses()
            assert.equal(updatedRequestorAddresses.length, 3)
            assert.equal(updatedRequestorAddresses[2], accounts[3])
            // console.log(updatedRequestorAddresses)
        })
    })


    contract('authorizeRequestorAddress', async () => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_GRANTED of ValueType Address', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[5])
            // console.log(reqTX)
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[5])
            // console.log(authTX)
            assert(authTX.logs.length === 1)
            assert(authTX.logs[0].event === 'EsEvent')
            let solidityEvent = authTX.logs[0].args

            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_GRANTED', 'expected event to be on type EVENT_STORE_ACCESS_GRANTED')

            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[5], "expected AddressValue to be accounts[5]")
            // console.log( solidityEvent ) 
        })
    })

    contract('isAddressAuthorized', async () => {
        it('returns true for addresses that have been authorized', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[5])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[5])
            let isAddress5Authorized = await _eventStore.isAddressAuthorized(accounts[5])
            assert.equal(isAddress5Authorized, true, "expected address 5 to be authorized]")
        })
    })

    contract('revokeRequestorAddress', async () => {
        it('emits a EsEvent, EVENT_STORE_ACCESS_REVOKED of ValueType Address', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[5])
            // console.log(reqTX)
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[5])
            // console.log(authTX)
            let revokeTX = await _eventStore.revokeRequestorAddress(accounts[5])
            // console.log(authTX)
            assert(revokeTX.logs.length === 1)
            assert(revokeTX.logs[0].event === 'EsEvent')
            let solidityEvent = revokeTX.logs[0].args

            assert.equal(toAscii(solidityEvent.Type), 'EVENT_STORE_ACCESS_REVOKED', 'expected event to be on type EVENT_STORE_ACCESS_REVOKED')

            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

            assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
            assert.equal(solidityEvent.AddressValue, accounts[5], "expected AddressValue to be accounts[5]")
            // console.log( solidityEvent ) 
        })
    })

    contract('writeEvent', async () => {
        it('throws an error if called by an unauthorized address', async () => {
            try {
                let tx = await _eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, PropertyCount, {
                    from: accounts[3],
                    gas: 2000000
                })
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }

            // console.log(tx)
        })

        it('emits a EsEvent, ' + Type + ' of ValueType Address', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[5])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[5])

            let tx = await _eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, PropertyCount, {
                from: accounts[5],
                gas: 2000000
            })

            // console.log(tx)
            let solidityEvent = tx.logs[0].args
            assert.equal(toAscii(solidityEvent.Type), Type, 'expected event to be on type ' + Type)
            assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
            assert.equal(solidityEvent.TxOrigin, accounts[5], "expected TxOrigin to be accounts[5]")
        })
    })

    contract('writeEventProperty', async () => {
        it('throws an error if called by an unauthorized address', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[5])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[5])
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1, {
                from: accounts[5],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            try {
                let propTx = await _eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', {
                    from: accounts[3],
                    gas: 2000000
                })
                // console.log(propTx)
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })

        it('throws an error if property already exists', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[6])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[6])
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1, {
                from: accounts[6],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let propTx = await _eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', {
                from: accounts[6],
                gas: 2000000
            })
            try {
                let propTx = await _eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue2', {
                    from: accounts[6],
                    gas: 2000000
                })
                // console.log(propTx)
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })

        it('emit a EsEventProperty', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[7])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[7])
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1, {
                from: accounts[7],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let propTx = await _eventStore.writeEventProperty(solidityEvent.Id, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', {
                from: accounts[7],
                gas: 2000000
            })
            assert(propTx.logs.length === 1)
            assert(propTx.logs[0].event === 'EsEventProperty')
            let solidityEventProp = propTx.logs[0].args
            assert.equal(toAscii(solidityEventProp.Type), 'Bytes32', 'expected event prop type to be Bytes32')
            assert.equal(toAscii(solidityEventProp.Bytes32Value), 'CustomValue', 'expected event prop bytes32Value to be CustomValue')
        })
    })



    contract('readEvent', async () => {
        it('throws an error if called by an unauthorized address', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[2])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[2])
            let eventTx = await _eventStore.writeEvent(Type, Version, ValueType, AddressValue, UIntValue, Bytes32Value, PropertyCount, {
                from: accounts[2],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            try {
                let eventType = await _eventStore.readEvent.call(solidityEvent.Id, {
                    from: accounts[4],
                    gas: 2000000
                })
                // console.log(eventType)
            } catch (e) {
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })
        it('emits a EsEvent', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[3])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[3])
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1, {
                from: accounts[3],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let returnVals = await _eventStore.readEvent.call(solidityEvent.Id, {
                from: accounts[3]
            })

            // console.log(returnVals)

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

            let txOrigin = returnVals[7]
            assert.equal(txOrigin, solidityEvent.TxOrigin, 'expected read to match write')

            let created = returnVals[8].toNumber()
            assert.equal(created, solidityEvent.Created.toNumber(), 'expected read to match write')

            let propCount = returnVals[9].toNumber()
            assert.equal(propCount, solidityEvent.PropertyCount.toNumber(), 'expected read to match write')

        })
    })

    contract('readEventProperty', async () => {
        it('throws an error if called by an unauthorized address', async () => {
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1)
            let solidityEvent = eventTx.logs[0].args
            let lastEventId = solidityEvent.Id.toNumber()
            let propWriteTx = await _eventStore.writeEventProperty(lastEventId, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue')
            try {
                let eventType = await _eventStore.readEventProperty.call(lastEventId, 0, {
                    from: accounts[5],
                    gas: 2000000
                })
                // console.log(eventType)
            } catch (e) {
                // console.log(e)
                assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
            }
        })
        it('emits a EsEventProperty', async () => {
            let reqTX = await _eventStore.addRequestorAddress(accounts[3])
            let authTX = await _eventStore.authorizeRequestorAddress(accounts[3])
            let eventTx = await _eventStore.writeEvent(Type, Version, 'Object', 0, 0, '', 1, {
                from: accounts[3],
                gas: 2000000
            })
            let solidityEvent = eventTx.logs[0].args
            let lastEventId = solidityEvent.Id.toNumber()
            let propWriteTx = await _eventStore.writeEventProperty(lastEventId, 0, 'CustomKey', 'Bytes32', 0, 0, 'CustomValue', {
                from: accounts[3],
                gas: 2000000
            })
             let returnVals = await _eventStore.readEventProperty.call(lastEventId, 0, {
                from: accounts[3]
            })

            // console.log(returnVals)

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
        })
    })
})
