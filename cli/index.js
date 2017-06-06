const vorpal = require('vorpal')()

var { TransmuteFramework } = require('../build/TransmuteFramework')

let {web3} = TransmuteFramework.init()

const {
    createEventStore,
    writeEvent,
    syncEventStore
} = require('./eventstore/eventstore')

console.log('\n👑   Transmute Framework   👑\n')

vorpal
  .command('patch', 'Patch Truffle Migrations')
  .action((args, callback) => {
    let { patchMigrations } = require('./commands/patchMigrations')
    let { addTransmuteContracts } = require('./commands/moveContracts')
    let { addTransmuteTests } = require('./commands/moveTests')
    addTransmuteContracts((err) => {
      addTransmuteTests()
      patchMigrations()
      callback()
    })
  })

vorpal
  .command('unpatch', 'UnPatch Truffle Migrations')
  .action((args, callback) => {
    let { unpatchMigrations } = require('./commands/unpatchMigrations')
    let { removeTransmuteContracts } = require('./commands/moveContracts')
    removeTransmuteContracts((err) => {
      unpatchMigrations()
      callback()
    })
  })


vorpal
  .command('migrate', 'Wrapper around truffle migrate')
  .action((args, callback) => {
    console.log()
    console.log('🍄  Running Truffle Migrate ...')
    var exec = require('child_process').exec
    exec('truffle migrate',  (error, stdout, stderr) => {
      console.log()
      console.log(stdout)

      if (error !== null) {
        console.log('exec error: ' + error)
      }
      callback()
    })
  })

vorpal
  .command('eventstore create', 'A command line interface to eventstores')
  .action((args, callback) => {
    web3.eth.getAccounts( async (err, addresses) => {
        if (err) { throw err }
        if (args.options.from === undefined){
          args.options.from = addresses[0]
        }
        let newAddress = await createEventStore(args.options.from);
        console.log('🎁  ' + newAddress + ' EventStore created...')
        console.log()
        callback()
    })
  })

  vorpal
  .command('eventstore show ', 'A command line interface to eventstores')
  .option('-f, --from <from>', 'from address')
  .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  .types({
    string: ['contractAddress']
  })
  .action((args, callback) => {
    web3.eth.getAccounts( async (err, addresses) => {
        if (err) { throw err }
        if (args.options.from === undefined){
          args.options.from = addresses[0]
        }
        // console.log(args)
        let bindingModel = {
          contractAddress: args.options.contractAddress,
          fromAddress: args.options.from
        }
        // console.log(bindingModel)
        let readModel = await syncEventStore(bindingModel);
              console.log(readModel)
              console.log()
        callback()
    })
  })

  vorpal
  .command('eventstore write ', 'Write an event to an event store')
  .option('-f, --from <from>', 'from address')
  .option('-c, --contractAddress <contractAddress>', 'contractAddress...')
  .option('-t, --type <type>', 'event type')
  .option('-p, --payload <payload>', 'event payload')
  .types({
    string: ['event', 'contractAddress']
  })
  .action((args, callback) => {
    web3.eth.getAccounts( async (err, addresses) => {
        if (err) { throw err }
        if (args.options.from === undefined){
          args.options.from = addresses[0]
        }
        // console.log(args)
        let bindingModel = {
          contractAddress: args.options.contractAddress,
          fromAddress: args.options.from,
          event: {
            type: args.options.type,
            payload: args.options.payload
          }
        }
        // console.log(bindingModel)
        let readModel = await writeEvent(bindingModel);
        console.log(readModel)
        console.log()
        callback()
    })
  })

  vorpal
  .command('web3 [cmd]', 'A command line interface to web3')
  .autocomplete(['accounts'])
  .action((args, callback) => {
    web3.eth.getAccounts( async (err, addresses) => {
        if (err) { throw err }
        console.log('Accounts: \n' + addresses.join('\n'))
      callback()
    })
  })

vorpal
  // .delimiter('🦄   $')
  // .show()
  .parse(process.argv)


