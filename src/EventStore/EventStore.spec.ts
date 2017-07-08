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

    describe('can write UnmarshalledEsCommand and read IFSAEvent', () => {
        unMarshalledExpectedEvents.forEach((unMarshalledExpectedEvent) => {
            describe(unMarshalledExpectedEvent.valueType, () => {
                let eventId
                it('.writeUnmarshalledEsCommand', async () => {
                    let tx = await TransmuteFramework.EventStore.writeUnmarshalledEsCommand(eventStore, web3.eth.accounts[0], unMarshalledExpectedEvent)
                    assert.lengthOf(tx.logs, 1)
                    assert.equal(tx.logs[0].event, 'EsEvent')
                    let fsa = TransmuteFramework.EventStore.Common.getFSAFromEventArgs(tx.logs[0].args)
                    eventId = fsa.meta.id
                })
                it('.readFSA', async () => {
                    let fsa = await TransmuteFramework.EventStore.readFSA(eventStore, web3.eth.accounts[0], eventId)
                    assert(fsa.meta.id, eventId)
                    // TODO: Add more tests here...
                })
            })
        })
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
