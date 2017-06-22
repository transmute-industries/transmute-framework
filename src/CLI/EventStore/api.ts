

const path = require('path')

import TransmuteFramework from '../../TransmuteFramework'

const eventStoreArtifacts = require('../../../build/contracts/EventStore')
const eventStoreFactoryArtifacts = require('../../../build/contracts/EventStoreFactory')

const { getCachedReadModel } = TransmuteFramework.EventStore

// // need to rename these before adding other read models
import { readModel, reducer } from './reducer'

import * as _ from 'lodash'

const {
    web3,
    EventStoreContract,
    EventStoreFactoryContract,
    EventStore,
    TransmuteIpfs
} = TransmuteFramework.init({
        env: 'testrpc',
        esa: eventStoreArtifacts,
        esfa: eventStoreFactoryArtifacts
    })

const createEventStore = async (factory, fromAddress) => {
    const { tx, events } = await TransmuteFramework.EventStore.EventStoreFactory.createEventStore(
        factory,
        fromAddress
    )
    const newEsAddress = events[0].AddressValue
    return newEsAddress
}


const syncEventStore = async (bindingModel) => {
    let { contractAddress, fromAddress } = bindingModel
    let eventStore = await EventStoreContract.at(contractAddress)
    let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
    return updatedReadModel
}

const writeEvent = async (bindingModel) => {
    let { contractAddress, fromAddress, event } = bindingModel
    event = _.cloneDeep(event)
    let eventStore = await EventStoreContract.at(contractAddress)
    let events = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, fromAddress, event)
    let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
    return updatedReadModel
}

export default (vorpal) => {

    vorpal
        .command('eventstore create', 'Create an EventStore')
        .action((args, callback) => {

            web3.eth.getAccounts(async (err, addresses) => {
                if (err) { throw err }
                if (args.options.from === undefined) {
                    args.options.from = addresses[0]
                }
                let fromAddress = args.options.from
                let factory = await EventStoreFactoryContract.deployed()
                let contractAddress = await createEventStore(factory, fromAddress)
                console.log('🎁  ' + contractAddress + ' EventStore created...')
                callback()
            })

        })

    vorpal
        .command('eventstore show', 'Show an EventStore')
        .option('-f, --from <from>', 'from address')
        .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
        .types({
            string: ['contractAddress']
        })
        .action((args, callback) => {

            web3.eth.getAccounts(async (err, addresses) => {
                if (err) { throw err }
                if (args.options.from === undefined) {
                    args.options.from = addresses[0]
                }
                let fromAddress = args.options.from
                let bindingModel = {
                    contractAddress: args.options.contractAddress,
                    fromAddress: args.options.from
                }
                let updatedReadModel = await syncEventStore(bindingModel);
                console.log(updatedReadModel)
                callback()
            })

        })


    vorpal
        .command('eventstore write', 'Write an Event to an EventStore')
        .option('-f, --from <from>', 'from address')
        .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
        .option('-t, --type <type>', 'event type')
        .option('-p, --payload <payload>', 'event payload')
        .types({
            string: ['contractAddress']
        })
        .action((args, callback) => {

            web3.eth.getAccounts(async (err, addresses) => {
                if (err) { throw err }
                if (args.options.from === undefined) {
                    args.options.from = addresses[0]
                }
                let fromAddress = args.options.from
                let bindingModel = {
                    contractAddress: args.options.contractAddress,
                    fromAddress: args.options.from,
                    event: {
                        type: args.options.type,
                        payload: args.options.payload
                    }
                }

                let updatedReadModel = await writeEvent(bindingModel);
                console.log(updatedReadModel)
                callback()
            })

        })

    return vorpal

}
