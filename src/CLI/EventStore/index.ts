// var path = require('path')

// var TransmuteFramework = require('../../build/TransmuteFramework').default

// let { web3, EventStoreContract, EventStoreFactoryContract } = TransmuteFramework.init()

// let { getCachedReadModel } = TransmuteFramework.EventStore.ReadModel

// // These should be updated to be permissions and default event oriented
// var { readModel, reducer } = require('./legacy/reducer')

// var _ = require('lodash')

// // transmute eventstore create --from 0x23b...
// // - create a new event store
// const createEventStore = async (fromAddress) => {
//     const esf = TransmuteFramework.EventStore.EventStoreFactory
//     const factory = await EventStoreFactoryContract.deployed()
//     const { tx, events } = await esf.createEventStore(factory, fromAddress)
//     const newEsAddress = events[0].AddressValue
//     return newEsAddress
// }

// // transmute eventstore show
// // - show the current event store read model
// const syncEventStore = async (bindingModel, _callback) =>{
//   let { contractAddress, fromAddress } = bindingModel
//   let eventStore = await EventStoreContract.at(contractAddress)
//   let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
//   return updatedReadModel
// }

// // transmute eventstore write --from 0x23b... --event { type: '...', payload: {...} }
// // - write and display a transmute event

// const writeEvent = async(bindingModel, _callback) => {
//   let { contractAddress, fromAddress,  event } = bindingModel
//   event = _.cloneDeep(event)
//   let eventStore = await EventStoreContract.at(contractAddress)
//   let events = await TransmuteFramework.EventStore.writeTransmuteCommand(eventStore, fromAddress, event )
//   let updatedReadModel = await getCachedReadModel(contractAddress, eventStore, fromAddress, readModel, reducer)
//   return updatedReadModel
// }

// module.exports = {
//     createEventStore,
//     writeEvent,
//     syncEventStore
// }



// vorpal
//   .command('eventstore create', 'A command line interface to eventstores')
//   .action((args, callback) => {
//     web3.eth.getAccounts(async (err, addresses) => {
//       if (err) { throw err }
//       if (args.options.from === undefined) {
//         args.options.from = addresses[0]
//       }
//       let newAddress = await createEventStore(args.options.from);
//       console.log('🎁  ' + newAddress + ' EventStore created...')
//       console.log()
//       callback()
//     })
//   })

// vorpal
//   .command('eventstore show ', 'A command line interface to eventstores')
//   .option('-f, --from <from>', 'from address')
//   .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
//   .types({
//     string: ['contractAddress']
//   })
//   .action((args, callback) => {
//     web3.eth.getAccounts(async (err, addresses) => {
//       if (err) { throw err }
//       if (args.options.from === undefined) {
//         args.options.from = addresses[0]
//       }
//       // console.log(args)
//       let bindingModel = {
//         contractAddress: args.options.contractAddress,
//         fromAddress: args.options.from
//       }
//       // console.log(bindingModel)
//       let readModel = await syncEventStore(bindingModel);
//       console.log(readModel)
//       console.log()
//       callback()
//     })
//   })

// vorpal
//   .command('eventstore write ', 'Write an event to an event store')
//   .option('-f, --from <from>', 'from address')
//   .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
//   .option('-t, --type <type>', 'event type')
//   .option('-p, --payload <payload>', 'event payload')
//   .types({
//     string: ['event', 'contractAddress']
//   })
//   .action((args, callback) => {
//     web3.eth.getAccounts(async (err, addresses) => {
//       if (err) { throw err }
//       if (args.options.from === undefined) {
//         args.options.from = addresses[0]
//       }
//       // console.log(args)
//       let bindingModel = {
//         contractAddress: args.options.contractAddress,
//         fromAddress: args.options.from,
//         event: {
//           type: args.options.type,
//           payload: args.options.payload
//         }
//       }
//       // console.log(bindingModel)
//       let readModel = await writeEvent(bindingModel);
//       console.log(readModel)
//       console.log()
//       callback()
//     })
//   })