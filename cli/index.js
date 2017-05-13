const vorpal = require('vorpal')()

console.log('\n👑   Transmute Framework   👑\n')

vorpal
  .command('patch', 'Patch Truffle Migrations')
  .action((args, callback) => {
    let { patchMigrations  } = require('./commands/patchMigrations')
    let { addTransmuteContracts } = require('./commands/moveContracts')
    addTransmuteContracts((err) =>{
      patchMigrations()
      callback();
    })
  })

vorpal
  .command('unpatch', 'UnPatch Truffle Migrations')
  .action((args, callback) => {
    let { unpatchMigrations  } = require('./commands/unpatchMigrations')
    let { removeTransmuteContracts } = require('./commands/moveContracts')
    removeTransmuteContracts((err) =>{
      unpatchMigrations()
      callback();
    })
  })

vorpal
  .delimiter('🦄   $')
  .show()