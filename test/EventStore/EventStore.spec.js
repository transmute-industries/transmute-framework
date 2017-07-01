
const Web3 = require('web3')

const EventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/EventStoreFactory.sol')
const EventStore = artifacts.require('./TransmuteFramework/EventStore/EventStore.sol')

const { marshalEvent, unMarshalEvent } = require('./Common')

describe('', () => {

    let factory, eventStore

    before(async () => {
        factory = await EventStoreFactory.deployed()
    })

    contract('EventStore', (accounts) => {

        let clientEvents = [
            {
                meta: 'MUTEX_LOCK',
                type: 'A',
                data: accounts[0]
            },
            {
                meta: 'MUTEX_LOCK',
                type: 'U',
                data: 1337
            },
            {
                meta: 'MUTEX_LOCK',
                type: 'B',
                data: '0x0000000000000000000000000000000000000000000000000000000000000003'
            },
            {
                meta: 'MUTEX_LOCK',
                type: 'I',
                data: 'QmRrehjkb86JvJcNJwdRBmnBL7a6Etkaooc98hvrXSCpn7'
            }
        ]

        it('the factory caller is the event store contract creator', async () => {
            let _tx = await factory.createEventStore({ from: accounts[1], gas: 2000000 })
            let event = _tx.logs[0].args
            let unMarshalledEvent = unMarshalEvent(
                event.Meta, 
                event.Type, 
                event.Data
            )
            eventStore = EventStore.at(unMarshalledEvent.data)
            let creator = await eventStore.creator()
            assert(creator === accounts[1])
        })

        it('the factory is the event store owner', async () => {
            let owner = await eventStore.owner()
            assert(owner === factory.address)
        })

        clientEvents.forEach((clientEvent)=>{
        
            it('can write & read events of type ' + clientEvent.type, async () => {

                let originalEvent = clientEvent

                let marshalledEvent = marshalEvent(
                    originalEvent.meta,
                    originalEvent.type,
                    originalEvent.data
                )

                let _tx = await eventStore.writeEvent(
                    marshalledEvent.meta, 
                    marshalledEvent.type, 
                    marshalledEvent.data, 
                    { from: accounts[1], gas: 2000000}
                )

                let event = _tx.logs[0].args
                let eventId = event.Id.toNumber()

                let unMarshalledEvent = unMarshalEvent(event.Meta, event.Type, event.Data)

                assert.equal(originalEvent.meta, unMarshalledEvent.meta)
                assert.equal(originalEvent.type, unMarshalledEvent.type)
                assert.equal(originalEvent.data, unMarshalledEvent.data)

                let esEventValues = await eventStore.readEvent.call(eventId, {
                    from: accounts[1]
                })

                assert.equal(esEventValues[0].toNumber(), eventId)
                assert.equal(esEventValues[1], accounts[1])

                let unMarshalledEvent2 = unMarshalEvent(esEventValues[3], esEventValues[4], esEventValues[5])

                assert.equal(originalEvent.meta, unMarshalledEvent2.meta)
                assert.equal(originalEvent.type, unMarshalledEvent2.type)
                assert.equal(originalEvent.data, unMarshalledEvent2.data)
            })
        })
    })
})
