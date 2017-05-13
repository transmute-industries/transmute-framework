const vorpal = require('vorpal')()

console.log('\n👑   Transmute Framework   👑\n')

vorpal
  .command('patch', 'Patch Truffle Migrations')
  .action((args, callback) => {
    let { patchMigrations } = require('./commands/patchMigrations')
    let { addTransmuteContracts } = require('./commands/moveContracts')
    addTransmuteContracts((err) => {
      patchMigrations()
      callback();
    })
  })

vorpal
  .command('unpatch', 'UnPatch Truffle Migrations')
  .action((args, callback) => {
    let { unpatchMigrations } = require('./commands/unpatchMigrations')
    let { removeTransmuteContracts } = require('./commands/moveContracts')
    removeTransmuteContracts((err) => {
      unpatchMigrations()
      callback();
    })
  })


vorpal
  .command('migrate', 'Wrapper around truffle migrate')
  .action((args, callback) => {
    console.log();
    console.log('🍄  Running Truffle Migrate ...')
    var exec = require('child_process').exec;
    exec('truffle migrate',  (error, stdout, stderr) => {
      console.log();
      console.log(stdout)

      if (error !== null) {
        console.log('exec error: ' + error);
      }
      callback();
    });
  })

vorpal
  .delimiter('🦄   $')
  .show()
  .parse(process.argv)