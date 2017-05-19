var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var UIntSetSpec = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol')

contract('UIntSetSpec', function (accounts) {

  var testInstance = null
  var size = 0

  it('test deployed', async () => {
    testInstance = await UIntSetSpec.deployed()
  })

  it('test add, last', async () => {
    testInstance.add(0).then((_tx) => ++size)
    assert.equal((await testInstance.last.call()).toNumber(), 0)
    testInstance.add(1).then((_tx) => ++size)
    assert.equal((await testInstance.last.call()).toNumber(), 1)
    testInstance.add(2).then((_tx) => ++size)
    assert.equal((await testInstance.last.call()).toNumber(), 2)
    testInstance.add(3).then((_tx) => ++size)
    assert.equal((await testInstance.last.call()).toNumber(), 3)
    testInstance.add(4).then((_tx) => ++size)
    assert.equal((await testInstance.last.call()).toNumber(), 4)
  })

  it('test indexOf', async () => {
    testInstance.indexOf.call(0).then((_index) => assert.equal(_index, 0))
    testInstance.indexOf.call(1).then((_index) => assert.equal(_index, 1))
    testInstance.indexOf.call(2).then((_index) => assert.equal(_index, 2))
    testInstance.indexOf.call(3).then((_index) => assert.equal(_index, 3))
    testInstance.indexOf.call(4).then((_index) => assert.equal(_index, 4))
  })

  it('test remove, first', async () => {
    assert.equal((await testInstance.first.call()).toNumber(), 0)
    testInstance.remove(0).then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal((await testInstance.first.call()).toNumber(), 4)
    testInstance.remove(4).then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal((await testInstance.first.call()).toNumber(), 3)
    testInstance.remove(3).then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal((await testInstance.first.call()).toNumber(), 2)
    testInstance.remove(2).then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal((await testInstance.first.call()).toNumber(), 1)
    testInstance.remove(1).then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
  })

  it('test add, remove, contains', async () => {
    await testInstance.add(5).then((_tx) => ++size)
    await testInstance.add(6).then((_tx) => ++size)
    await testInstance.add(7).then((_tx) => ++size)
    await testInstance.add(8).then((_tx) => ++size)
    await testInstance.add(9).then((_tx) => ++size)
    assert.equal(await testInstance.contains.call(5), true)
    assert.equal(await testInstance.contains.call(6), true)
    assert.equal(await testInstance.contains.call(7), true)
    assert.equal(await testInstance.contains.call(8), true)
    assert.equal(await testInstance.contains.call(9), true)
    await testInstance.remove(9).then((_tx) => --size)
    await testInstance.remove(8).then((_tx) => --size)
    await testInstance.remove(7).then((_tx) => --size)
    assert.equal(await testInstance.contains.call(7), false)
    assert.equal(await testInstance.contains.call(8), false)
    assert.equal(await testInstance.contains.call(9), false)
  })

  it('test get, set', async () => {
    await testInstance.set(0, 0)
    testInstance.get.call(0).then((_value) => assert.equal(_value.toNumber(), 0))
    await testInstance.set(1, 0)
    testInstance.get.call(1).then((_value) => assert.equal(_value.toNumber(), 6))
  })
})
