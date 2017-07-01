
// var Web3 = require('web3')

// var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

// var { Events } = require('./Mock')

// var { toAscii, isVmException } = require('./Common')

// describe('EventStore.writeEvent', () => {

//     beforeEach(async () => {
//         _eventStore = await EventStore.deployed()
//     })

//     function writeEvent({Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue}, options) {
//         return _eventStore.writeEvent(Type, Version, ValueType, IsAuthorized, PermissionDomain, AddressValue, UIntValue, Bytes32Value, StringValue, options)
//     }

//     contract('EventStore', (accounts) => {

//         contract('writeEvent', async () => {
//             it('throws a vm exception if called by an unauthorized address and event is authorized', async () => {
//                 try {
//                     let tx = await writeEvent(Events.testAuthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})
//                 } catch (e) {
//                     assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
//                 }
//             })

//             it('throws a vm exception if called by an unauthorized ACLAddress and event is authorized', async () => {
//                 try {
//                     let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', '', false, 'ES', accounts[1])
//                     let tx = await writeEvent(Events.testAuthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})
//                 } catch (e) {
//                     assert.equal(isVmException(e), true, "expected an unauthorized write to cause a vm exception")
//                 }
//             })

//             it('emits an EsEvent ' + Events.testAuthorizedAddressValueEvent.Type + ' of ValueType Address if called by an unauthorized ACLAddress and event is unauthorized', async () => {
//                 let tx = await writeEvent(Events.testUnauthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})

//                 let solidityEvent = tx.logs[0].args
//                 assert.equal(toAscii(solidityEvent.Type), Events.testUnauthorizedAddressValueEvent.Type, 'expected event to be on type ' + Events.testUnauthorizedAddressValueEvent.Type)
//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[1], "expected TxOrigin to be accounts[1]")
//             })

//             it('emits an EsEvent ' + Events.testAuthorizedAddressValueEvent.Type + ' of ValueType Address if called by an authorized ACLAddress and event is authorized', async () => {
//                 let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
//                 let grantTX = await _eventStore.grantWriteAccess('ES_WRITE_GRANTED', true, 'ES', accounts[1])
//                 let tx = await writeEvent(Events.testAuthorizedAddressValueEvent, {from: accounts[1], gas: 2000000})

//                 let solidityEvent = tx.logs[0].args
//                 assert.equal(toAscii(solidityEvent.Type), Events.testAuthorizedAddressValueEvent.Type, 'expected event to be on type ' + Events.testAuthorizedAddressValueEvent.Type)
//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[1], "expected TxOrigin to be accounts[1]")
//             })
//         })
//     })
// })
