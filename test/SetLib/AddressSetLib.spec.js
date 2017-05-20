// var Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
// var AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')

// contract('AddressSetSpec', function (accounts) {

//   var testInstance = null
//   var size = 0

//   it('test deployed', async () => {
//     testInstance = await AddressSetSpec.deployed()
//   })

//   it('test add, last', async () => {
//     testInstance.add(accounts[0]).then((_tx) => ++size)
//     assert.equal(await testInstance.last.call(), accounts[0])
//     testInstance.add(accounts[1]).then((_tx) => ++size)
//     assert.equal(await testInstance.last.call(), accounts[1])
//     testInstance.add(accounts[2]).then((_tx) => ++size)
//     assert.equal(await testInstance.last.call(), accounts[2])
//     testInstance.add(accounts[3]).then((_tx) => ++size)
//     assert.equal(await testInstance.last.call(), accounts[3])
//     testInstance.add(accounts[4]).then((_tx) => ++size)
//     assert.equal(await testInstance.last.call(), accounts[4])
//   })

//   it('test indexOf', async () => {
//     testInstance.indexOf.call(accounts[0]).then((_index) => assert.equal(_index, 0))
//     testInstance.indexOf.call(accounts[1]).then((_index) => assert.equal(_index, 1))
//     testInstance.indexOf.call(accounts[2]).then((_index) => assert.equal(_index, 2))
//     testInstance.indexOf.call(accounts[3]).then((_index) => assert.equal(_index, 3))
//     testInstance.indexOf.call(accounts[4]).then((_index) => assert.equal(_index, 4))
//   })

//   it('test remove, first', async () => {
//     assert.equal(await testInstance.first.call(), accounts[0])
//     testInstance.remove(accounts[0]).then((_tx) => --size)
//     assert.equal(await testInstance.size.call(), size)
//     assert.equal(await testInstance.first.call(), accounts[4])
//     testInstance.remove(accounts[4]).then((_tx) => --size)
//     assert.equal(await testInstance.size.call(), size)
//     assert.equal(await testInstance.first.call(), accounts[3])
//     testInstance.remove(accounts[3]).then((_tx) => --size)
//     assert.equal(await testInstance.size.call(), size)
//     assert.equal(await testInstance.first.call(), accounts[2])
//     testInstance.remove(accounts[2]).then((_tx) => --size)
//     assert.equal(await testInstance.size.call(), size)
//     assert.equal(await testInstance.first.call(), accounts[1])
//     testInstance.remove(accounts[1]).then((_tx) => --size)
//     assert.equal(await testInstance.size.call(), size)
//   })

//   it('test add, remove, contains', async () => {
//     await testInstance.add(accounts[5]).then((_tx) => ++size)
//     await testInstance.add(accounts[6]).then((_tx) => ++size)
//     await testInstance.add(accounts[7]).then((_tx) => ++size)
//     await testInstance.add(accounts[8]).then((_tx) => ++size)
//     await testInstance.add(accounts[9]).then((_tx) => ++size)
//     assert.equal(await testInstance.contains.call(accounts[5]), true)
//     assert.equal(await testInstance.contains.call(accounts[6]), true)
//     assert.equal(await testInstance.contains.call(accounts[7]), true)
//     assert.equal(await testInstance.contains.call(accounts[8]), true)
//     assert.equal(await testInstance.contains.call(accounts[9]), true)
//     await testInstance.remove(accounts[9]).then((_tx) => --size)
//     await testInstance.remove(accounts[8]).then((_tx) => --size)
//     await testInstance.remove(accounts[7]).then((_tx) => --size)
//     assert.equal(await testInstance.contains.call(accounts[7]), false)
//     assert.equal(await testInstance.contains.call(accounts[8]), false)
//     assert.equal(await testInstance.contains.call(accounts[9]), false)
//   })

//   it('test get, set', async () => {
//     await testInstance.set(0, accounts[0])
//     testInstance.get.call(0).then((_value) => assert.equal(_value, accounts[0]))
//     await testInstance.set(1, accounts[0])
//     testInstance.get.call(1).then((_value) => assert.equal(_value, accounts[6]))
//   })
// })
