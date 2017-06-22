const vorpal = require('vorpal')()

import TransmuteFramework from '../TransmuteFramework'

let { web3 } = TransmuteFramework.init()

console.log('\n👑   Transmute Framework   👑\n')

import Patch from './Patch/index'
import TransmuteIpfs from './TransmuteIpfs/index'

Patch(vorpal)
TransmuteIpfs(vorpal)

vorpal
    .command('web3 [cmd]', 'A command line interface to web3')
    .autocomplete(['accounts'])
    .action((args, callback) => {
        web3.eth.getAccounts(async (err, addresses) => {
            if (err) { throw err }
            console.log('Accounts: \n' + addresses.join('\n'))
            callback()
        })
    })

vorpal
    .command('migrate', 'Wrapper around truffle migrate')
    .action((args, callback) => {
        console.log()
        console.log('🍄  Running Truffle Migrate ...')
        var exec = require('child_process').exec
        exec('truffle migrate', (error, stdout, stderr) => {
            console.log()
            console.log(stdout)

            if (error !== null) {
                console.log('exec error: ' + error)
            }
            callback()
        })
    })


vorpal
    .command('test', 'Wrapper around truffle test')
    .action((args, callback) => {
        console.log()
        console.log('🍄  Running Truffle Test ...')
        var exec = require('child_process').exec
        exec('truffle test', (error, stdout, stderr) => {
            console.log()
            console.log(stdout)

            if (error !== null) {
                console.log('exec error: ' + error)
            }
            callback()
        })
    })

vorpal
    // .delimiter('🦄   $')
    // .show()
    .parse(process.argv)


