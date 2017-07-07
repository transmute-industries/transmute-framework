// "use strict";

// import TransmuteFramework from '../../TransmuteFramework'

// const { web3, EventStoreContract } = TransmuteFramework.init()

// const moment = require('moment')
// const contract = require('truffle-contract')

// import { expect, assert, should } from 'chai'

// import {
//   JSON_SCHEMA,
// } from '../Mock/data'


// import { EventTypes } from './EventTypes'


// import {
//     addressValueEsEvent,
//     bytes32ValueEsEvent,
//     uIntValueEsEvent,

//     addressCommand,
//     numberCommand,
//     stringCommand,
//     objectCommand

// } from '../Mock/Events/TestEvents'

// describe("EventTypes", () => {

//     let eventStore

//     before(async () => {
//         eventStore = await EventStoreContract.deployed()
//     })

//     describe('.getEsEventFromEsEventValues', () => {
//         let eventIndex
//         let txArgs
//         before(async () => {
//             let tx = await TransmuteFramework.EventStore.writeUnmarshalledEsCommand(eventStore, web3.eth.accounts[0], addressValueEsEvent)
//             assert.lengthOf(tx.logs, 1)
//             assert.equal(tx.logs[0].event, 'EsEvent')
//             txArgs = tx.logs[0].args
//             eventIndex = tx.logs[0].args.Id.toNumber()
//         })

//         it('converts a list of EsValues to an EsEvent object, like we get in tx.logs', async () => {
//             let eventValues = await TransmuteFramework.EventStore.readEsEventValues(eventStore, web3.eth.accounts[0], eventIndex)
//             let esEvent = EventTypes.getEsEventFromEsEventValues(eventValues)
//             assert.equal(esEvent.Type, txArgs.Type)
//             assert.equal(web3.isAddress(esEvent.TxOrigin), true, "expected TxOrigin to be an address")
//             assert.equal(esEvent.TxOrigin, txArgs.TxOrigin, "expected TxOrigin to be 0x0...")
//         })
//     })

//     describe(".flatten", () => {
//         it("should return the flat object, ready to be many EsEventProperties", () => {
//             let flatObj: any = EventTypes.flatten(JSON_SCHEMA.Person)
//             expect(flatObj.title == JSON_SCHEMA.Person.title)
//             expect(flatObj['properties.age.description'] == JSON_SCHEMA.Person.properties.age.description)
//         })
//     })

//     describe(".unflatten", () => {
//         it("should return a fat object, ready to be a payload", () => {
//             let flatObj = EventTypes.flatten(JSON_SCHEMA.Person)
//             let fatObj: any = EventTypes.unflatten(flatObj)
//             expect(fatObj.title == JSON_SCHEMA.Person.title)
//             expect(fatObj.properties.age.description == JSON_SCHEMA.Person.properties.age.description)
//         })
//     })

// });
