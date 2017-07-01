
// var Web3 = require('web3')

// var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

// var { toAscii } = require('./Common')


// describe('Permissions', () => {

//     beforeEach(async () => {
//         _eventStore = await EventStore.deployed()
//     })

//     contract('EventStore', (accounts) => {

//         contract('getACLAddresses', async () => {
//             it('contains nothing when first initialized', async () => {
//                 let creator = await _eventStore.creator()
//                 let initialACLAddresses = await _eventStore.getACLAddresses()
//                 assert(initialACLAddresses.length === 0)
//             })

//             it('contains a new address after that address requests access', async () => {
//                 let tx = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', '', false, 'ES', accounts[0])
//                 let updatedACLAddresses = await _eventStore.getACLAddresses()
//                 assert(updatedACLAddresses.length === 1)
//                 assert(updatedACLAddresses[0] === accounts[0])
//             })
//         })

//         contract('addACLAddress', async () => {
//             it('emits EsEvents: ES_ACCESS_REQUESTED of ValueType Address, ES_READ_GRANTED of ValueType Address, ES_WRITE_GRANTED of ValueType Address', async () => {
//                 let tx = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[1])
//                 assert(tx.logs.length === 3)
//                 assert(tx.logs[0].event === 'EsEvent')
//                 let accessRequestedEvent = tx.logs[0].args
//                 let readGrantedEvent = tx.logs[1].args
//                 let writeGrantedEvent = tx.logs[2].args

//                 assert.equal(toAscii(accessRequestedEvent.Type), 'ES_ACCESS_REQUESTED', 'expected event to be on type ES_ACCESS_REQUESTED')
//                 assert.equal(toAscii(readGrantedEvent.Type), 'ES_READ_GRANTED', 'expected event to be on type ES_READ_GRANTED')
//                 assert.equal(toAscii(writeGrantedEvent.Type), 'ES_WRITE_GRANTED', 'expected event to be on type ES_WRITE_GRANTED')

//                 assert.equal(web3.isAddress(accessRequestedEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(accessRequestedEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

//                 assert.equal(toAscii(accessRequestedEvent.ValueType), "Address", "expected ValueType to be Address")
//                 assert.equal(accessRequestedEvent.AddressValue, accounts[1], "expected AddressValue to be accounts[1]")
//             })

//             it('adds a requestor address to the requestorAddress AddressSet', async () => {
//                 let initialACLAddresses = await _eventStore.getACLAddresses()
//                 assert.equal(initialACLAddresses.length, 1, 'expected 1 address at this point')
//                 let tx = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', '', false, 'ES', accounts[2])
//                 let updatedACLAddresses = await _eventStore.getACLAddresses()
//                 assert.equal(updatedACLAddresses.length, 2)
//                 assert.equal(updatedACLAddresses[1], accounts[2])
//             })
//         })

//         contract('grantReadAccess', async () => {
//             it('emits a EsEvent, ES_READ_GRANTED of ValueType Address', async () => {
//                 let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
//                 let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', '', false, 'ES', accounts[1])
//                 let grantTX = await _eventStore.grantReadAccess('ES_READ_GRANTED', true, 'ES', accounts[1]);
//                 assert(reqTX.logs.length === 1)
//                 assert(grantTX.logs.length === 1)
//                 assert(grantTX.logs[0].event === 'EsEvent')
//                 let solidityEvent = grantTX.logs[0].args

//                 assert.equal(toAscii(solidityEvent.Type), 'ES_READ_GRANTED', 'expected event to be on type ES_READ_GRANTED')

//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

//                 assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
//                 assert.equal(solidityEvent.AddressValue, accounts[1], "expected AddressValue to be accounts[1]")
//             })
//         })

//         contract('revokeReadAccess', async () => {
//             it('emits a EsEvent, ES_READ_REVOKED of ValueType Address', async () => {
//                 let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
//                 let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', '', false, 'ES', accounts[1])
//                 let revokeTX = await _eventStore.revokeReadAccess('ES_READ_REVOKED', true, 'ES', accounts[1]);
//                 assert(reqTX.logs.length === 2)
//                 assert(revokeTX.logs.length === 1)
//                 assert(revokeTX.logs[0].event === 'EsEvent')
//                 let solidityEvent = revokeTX.logs[0].args

//                 assert.equal(toAscii(solidityEvent.Type), 'ES_READ_REVOKED', 'expected event to be on type ES_READ_REVOKED')

//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

//                 assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
//                 assert.equal(solidityEvent.AddressValue, accounts[1], "expected AddressValue to be accounts[1]")
//             })
//         })

//         contract('grantWriteAccess', async () => {
//             it('emits a EsEvent, ES_WRITE_GRANTED of ValueType Address', async () => {
//                 let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
//                 let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', '', false, 'ES', accounts[1])
//                 let grantTX = await _eventStore.grantWriteAccess('ES_WRITE_GRANTED', true, 'ES', accounts[1])
//                 assert(reqTX.logs.length === 1)
//                 assert(grantTX.logs.length === 1)
//                 assert(grantTX.logs[0].event === 'EsEvent')
//                 let solidityEvent = grantTX.logs[0].args

//                 assert.equal(toAscii(solidityEvent.Type), 'ES_WRITE_GRANTED', 'expected event to be on type ES_WRITE_GRANTED')

//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

//                 assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
//                 assert.equal(solidityEvent.AddressValue, accounts[1], "expected AddressValue to be accounts[1]")
//             })
//         })

//         contract('revokeWriteAccess', async () => {
//             it('emits an EsEvent, ES_WRITE_REVOKED of ValueType Address', async () => {
//                 let adminTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', 'ES_READ_GRANTED', 'ES_WRITE_GRANTED', false, 'ES', accounts[0])
//                 let reqTX = await _eventStore.addACLAddress('ES_ACCESS_REQUESTED', '', 'ES_WRITE_GRANTED', false, 'ES', accounts[1])
//                 let revokeTX = await _eventStore.revokeWriteAccess('ES_WRITE_REVOKED', true, 'ES', accounts[1])
//                 assert(reqTX.logs.length === 2)
//                 assert(revokeTX.logs.length === 1)
//                 assert(revokeTX.logs[0].event === 'EsEvent')
//                 let solidityEvent = revokeTX.logs[0].args

//                 assert.equal(toAscii(solidityEvent.Type), 'ES_WRITE_REVOKED', 'expected event to be on type ES_WRITE_REVOKED')

//                 assert.equal(web3.isAddress(solidityEvent.TxOrigin), true, "expected TxOrigin to be an address")
//                 assert.equal(solidityEvent.TxOrigin, accounts[0], "expected TxOrigin to be accounts[0]")

//                 assert.equal(toAscii(solidityEvent.ValueType), "Address", "expected ValueType to be Address")
//                 assert.equal(solidityEvent.AddressValue, accounts[1], "expected AddressValue to be accounts[1]")
//             })
//         })
//     })
// })
