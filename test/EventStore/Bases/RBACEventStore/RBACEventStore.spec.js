
const Web3 = require('web3')

const RBACEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStoreFactory.sol')
const RBACEventStore = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStore.sol')

const {
    getFSAFromEventArgs,
    getFSAFromEventValues,
    marshal,
    unmarshal
     } = require('../../../Common')

// TODO: Write tests for common....

describe.only('', () => {

    let factory, eventStore

    before(async () => {
        factory = await RBACEventStoreFactory.deployed()
    })

    contract('RBACEventStore', (accounts) => {

        let unMarshalledExpectedEvents = [
            {
                id: 0,
                txOrigin: accounts[0],
                created: 0, // we don't know this yet...
                eventType: 'MUTEX_LOCK',
                keyType: 'X',
                valueType: 'A',
                key: 'address',
                value: accounts[0]
            },
            {
                id: 1,
                txOrigin: accounts[0],
                created: 0,
                eventType: 'MUTEX_LOCK',
                keyType: 'X',
                valueType: 'U',
                key: 'code',
                value: 1337
            },
            {
                id: 2,
                txOrigin: accounts[0],
                created: 0,
                eventType: 'MUTEX_LOCK',
                keyType: 'X',
                valueType: 'B',
                key: 'bytes32',
                value: '0x0000000000000000000000000000000000000000000000000000000000000003'
            },
            {
                id: 3,
                txOrigin: accounts[0],
                created: 0,
                eventType: 'MUTEX_LOCK',
                keyType: 'X',
                valueType: 'X',
                key: 'welcomeMessage',
                value: 'Hello world'
            },
            {
                id: 3,
                txOrigin: accounts[0],
                created: 0,
                eventType: 'MUTEX_LOCK',
                keyType: 'X',
                valueType: 'I',
                key: 'multihash',
                value: 'QmRrehjkb86JvJcNJwdRBmnBL7a6Etkaooc98hvrXSCpn7'
            }
        ]

        it('the factory caller is the event store contract creator', async () => {
            let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
            let fsa = getFSAFromEventArgs(_tx.logs[0].args)
            eventStore = RBACEventStore.at(fsa.payload.address)
            let creator = await eventStore.creator()
            assert(creator === accounts[0])
        })

        it('the factory is the event store owner', async () => {
            let owner = await eventStore.owner()
            assert(owner === factory.address)
        })

        unMarshalledExpectedEvents.forEach((unMarshalledExpectedEvent) => {

            it('can write & read events of type ' + unMarshalledExpectedEvent.valueType, async () => {

                let originalEvent = unMarshalledExpectedEvent

                let marshalledEvent = marshal(
                    originalEvent.eventType,
                    originalEvent.keyType,
                    originalEvent.valueType,
                    originalEvent.key,
                    originalEvent.value
                )

                let _tx = await eventStore.writeEvent(
                    marshalledEvent.eventType,
                    marshalledEvent.keyType,
                    marshalledEvent.valueType,
                    marshalledEvent.key,
                    marshalledEvent.value,
                    { from: accounts[0], gas: 2000000 }
                )

                let event = _tx.logs[0].args
                let eventId = event.Id.toNumber()

                let fsa = getFSAFromEventArgs(event)

                assert.equal(originalEvent.eventType, fsa.type)
                assert.equal(originalEvent.key, Object.keys(fsa.payload)[0])
                assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]])

                let esEventValues = await eventStore.readEvent.call(eventId, {
                    from: accounts[0]
                })

                assert.equal(esEventValues[0].toNumber(), eventId)
                assert.equal(esEventValues[1], accounts[0])

                fsa = getFSAFromEventValues( ...esEventValues )
                // console.log(fsa)
                assert.equal(originalEvent.eventType, fsa.type)
                assert.equal(originalEvent.key, Object.keys(fsa.payload)[0])
                assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]])
            })
        })
    })
})
