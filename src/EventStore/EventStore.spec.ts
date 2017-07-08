'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { web3, EventStoreContract } = TransmuteFramework.init()

import { assert, expect, should } from 'chai'

import { unMarshalledExpectedEvents, fsaCommands } from './EventStore.mock'

describe('EventStore', () => {

    let eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
    })

    describe('can write IFSACommand and read IFSAEvent', () => {
        fsaCommands.forEach((fsac) => {
            describe(fsac.type, () => {
                let eventId
                it('.writeFSA', async () => {
                    // console.log(fsac)
                    let fsaEvent = await TransmuteFramework.EventStore.writeFSA(eventStore, web3.eth.accounts[0], fsac)
                    // console.log(fsaEvent)
                    assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                    eventId = fsaEvent.meta.id
                })

                it('.readFSA', async () => {
                    // console.log(fsac)
                    let fsaEvent = await TransmuteFramework.EventStore.readFSA(eventStore, web3.eth.accounts[0], eventId)
                    assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                    // console.log(fsaEvent)
                })
            })
        })
    })

    // These need to be rewritten....
    //   describe('.readTransmuteEvents', () => {
    //     let initialEventId, commands, cmdResponses
    //     before(async () => {
    //         initialEventId = (await eventStore.solidityEventCount()).toNumber()
    //         commands = [addressCommand, numberCommand, stringCommand, objectCommand]
    //         cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
    //         assert.lengthOf(cmdResponses, commands.length)
    //     })
    //     it('should return all transmute events after and including the given eventId', async () => {
    //         let transmuteEvents = await TransmuteFramework.EventStore.readTransmuteEvents(eventStore, web3.eth.accounts[0], initialEventId)
    //         assert.lengthOf(transmuteEvents, commands.length)
    //         // Add more tests here...
    //     })
    // })

    // describe('.writeTransmuteCommands', () => {
    //     it('should write an array of ITransmuteCommands and return and array of ITransmuteCommandResponse', async () => {
    //         let commands = [addressCommand, numberCommand, stringCommand, objectCommand]
    //         let cmdResponses = await TransmuteFramework.EventStore.writeTransmuteCommands(eventStore, web3.eth.accounts[0], commands)
    //         assert.lengthOf(cmdResponses, commands.length)
    //         // add more tests here...
    //     })
    // })

})


// describe('Read Model Tests', () => {

//     let eventStore

//     before(async () => {
//         eventStore = await EventStoreContract.deployed()
//         readModel.contractAddress = eventStore.address
//         readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
//     })

//     describe(".readModelGenerator", () => {
//         it("should return the initial read model when passed an empty array", () => {
//             // This will usually be overidden by the consumer
//             readModel.contractAddress = '0x0000000000000000000000000000000000000000'
//             let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [])
//             assert(_.isEqual(readModel, updatedReadModel), 'expected no changes from application of empty event array')
//         })

//         it("should return an updated read model when passed a non-empty event array", () => {
//             let registerEvent = <any>events[0]
//             let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, [registerEvent])
//             assert.equal(updatedReadModel.lastEvent, 0, 'expected event 0 to have been applied to the read model')
//             assert.equal(
//                 updatedReadModel.model.patient[registerEvent.payload.patientId].patientName,
//                 registerEvent.payload.patientName,
//                 'expected patient to be registered'
//             )
//         })

//         it("should handle multiple events fine", () => {
//             let updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, events)
//             // add some tests here maybe... but really just look at the file in temp
//             // writeReadModelToFile(updatedReadModel)
//         })
//     })

//     describe(".maybeSyncReadModel", () => {
//         let eventStore
//         let updatedReadModel: Common.IReadModel
//         before(async () => {
//             eventStore = await EventStoreContract.deployed()
//             let firstEvent = <any>_.omit(events[0], 'meta')
//             let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], firstEvent)
//             // console.log('txWithEvents: ', txWithEvents)
//             let newEvents = txWithEvents.events
//             readModel.contractAddress = eventStore.address
//             readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
//             updatedReadModel = TransmuteFramework.EventStore.readModelGenerator(readModel, reducer, newEvents)
//             // console.log(updatedReadModel)
//         })

//         it("should return the same read model if it is up to date", async () => {
//             let maybeUpdatedReadModel: Common.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
//             assert(_.isEqual(maybeUpdatedReadModel, updatedReadModel), 'expected no changes when no new events have been saved')
//         })

//         it("should return an updated read model when new events have been saved", async () => {
//             let secondEvent = <any>_.omit(events[1], 'meta')
//             let txWithEvents = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, web3.eth.accounts[0], secondEvent)
//             let maybeUpdatedReadModel: Common.IReadModel = await TransmuteFramework.EventStore.maybeSyncReadModel(eventStore, web3.eth.accounts[0], updatedReadModel, reducer)
//             // compareReadModels(updatedReadModel, maybeUpdatedReadModel)
//             assert.equal(maybeUpdatedReadModel.lastEvent, updatedReadModel.lastEvent + 1, 'expected 1 more event to have been applied')
//         })
//     })

// })
