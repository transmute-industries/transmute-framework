
var Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var EventStore = artifacts.require('./EventStore.sol')

const event = {
  Id: 0,
  Type: 'PROJECT_CREATED',
  AddressValue: web3.eth.accounts[0],
  UIntValue: 1,
  StringValue: 'Coral'
}

contract('EventStore', (accounts) => {

    it('test version', () => {
        return EventStore.deployed()
            .then((_esInstance) => {
                return _esInstance.getVersion()
            })
            .then((versionBigNum) => {
                let version = versionBigNum.toNumber()
                assert(version === 1)
            })
    })

    describe('emitEvent', () => {
        it('emits a NEW_EVENT', () => {
            return EventStore.deployed()
                .then((_esInstance) => {
                    return _esInstance
                        .emitEvent(event.Type, event.AddressValue, event.UIntValue, event.StringValue, {
                            from: accounts[0],
                            gas: 2000000
                        })
                })
                .then((tx) => {
                    // console.log(tx);
                    assert(tx.logs.length === 1)
                    assert(tx.logs[0].event === 'NEW_EVENT')
                })
        })
    })

})
