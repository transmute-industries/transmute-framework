
const { synchEventStore } = require('./eventstore')

contract('Transmute CLI', (accounts) => {

    describe('cli test', async () => {
        it('should return 1', async () => {
            console.log(accounts)
            synchEventStore()
            // let version = (await _eventStore.getVersion()).toNumber()
            // assert(version === 1)
        })
    })

})
