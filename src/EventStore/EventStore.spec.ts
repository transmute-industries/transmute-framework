'use strict'
import * as _ from 'lodash'
import TransmuteFramework from '../TransmuteFramework'

const { web3, EventStoreContract, EventStoreFactoryContract } = TransmuteFramework.init()

import { assert, expect, should } from 'chai'

import { fsaCommands } from './EventStore.mock'

import {
    readModel as permissionsReadModel,
    reducer as permissionsReducer
} from './Permissions/Reducer'


describe('EventStore', () => {

    let factory, eventStore

    before(async () => {
        eventStore = await EventStoreContract.deployed()
        factory = await EventStoreFactoryContract.deployed()
    })

    describe('can write IFSACommand and read IFSAEvent', () => {
        fsaCommands.forEach((fsac) => {
            describe(fsac.type, async () => {
                let fn = async () => {
                    let eventId, continueFlag
                    
                    let shouldThrow
                    before(() => shouldThrow = ('error' in fsac) ? true : false);
                    
                    it('.writeFSA', () => 
                        TransmuteFramework.EventStore.writeFSA(eventStore, web3.eth.accounts[0], fsac)
                       .then((fsaEvent) => {
                           assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                           eventId = fsaEvent.meta.id
                       })
                       .catch((error) => {
                            if (!shouldThrow) {
                                throw(error);
                            }
                       })

                       
                      )
                   
                    it('.readFSA', () =>
                        TransmuteFramework.EventStore.readFSA(eventStore, web3.eth.accounts[0], eventId)
                       .then((fsaEvent) => {
                           assert.equal(fsaEvent.type, fsac.type, 'expected types to match')
                           eventId = fsaEvent.meta.id
                       })
                       .catch((error) => {
                            if (!shouldThrow) {
                                throw(error);
                            }
                       })

                       
                      )
                }

                if (fsac.hasOwnProperty('error')) {
                    await assert.throws(fn);
                } else {
                    await fn();
                }
            })                            
        })
    })

    // These need to be rewritten....
    //   describe('.readTransmuteEvents', () => {
    //     let initialEventId, commands, cmdResponses
    //     before(async () => {
    //         initialEventId = (await eventStore.eventCount()).toNumber()
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


