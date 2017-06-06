
const { 
    createEventStore, 
    syncEventStore, 
    writeEvent 
} = require('./eventstore')

var ethUtils = require('ethereumjs-util')

contract('Transmute CLI', (accounts) => {
    let account0 = accounts[0]
    describe('createEventStore', async () => {
        it('create an eventstore via the factory and set it as selected', async () => {
            let newAddress = await createEventStore(account0)
            assert(ethUtils.isValidAddress(newAddress), ' expected a valid address to be returned')
        })
    })
    describe.only('writeEvent', async () => {
        it('should write an event and return updated read model', async () => {
            let newAddress = await createEventStore(account0)
            let readModel = await writeEvent({
                contractAddress: newAddress,
                fromAddress: account0,
                event:  {
                    type: "CLI_COMMAND_RECEIVED",
                    payload: "npm run transmute migrate"
                }
            })
            assert(readModel.readModelStoreKey !== undefined)
            // console.log(readModel)
        })
    })
    describe('syncEventStore', async () => {
        it('should return a synched readModel for the given event store', async () => {
            let newAddress = await createEventStore(account0)
            let readModel = await syncEventStore({
                contractAddress: newAddress,
                fromAddress: account0
            })
            assert(readModel.readModelStoreKey !== undefined)
            // console.log(readModel)
        })
    })
})

