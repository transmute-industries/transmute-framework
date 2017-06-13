

export default (vorpal) => {

    vorpal
        .command('patch', 'Patch Truffle Migrations')
        .action((args, callback) => {
            console.log('patching...')
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
            console.log('unpatching...')
            let { unpatchMigrations } = require('./commands/unpatchMigrations')
            let { removeTransmuteContracts } = require('./commands/moveContracts')
            removeTransmuteContracts((err) => {
                unpatchMigrations()
                callback()
            })
        })

    return vorpal

}