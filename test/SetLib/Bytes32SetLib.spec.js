var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var TestIndexedEnumerableSetLib = artifacts.require('./TransmuteFramework/TestIndexedEnumerableSetLib.sol')

contract('TestIndexedEnumerableSetLib', function (accounts) {

  var testInstance = null
  var size = 0

  it('test deployed', async () => {
    testInstance = await TestIndexedEnumerableSetLib.deployed()
  })

  it('test add, last', async () => {
    testInstance.add('A').then((_tx) => ++size)
    assert.equal(toAscii(await testInstance.last.call()), 'A')
    testInstance.add('B').then((_tx) => ++size)
    assert.equal(toAscii(await testInstance.last.call()), 'B')
    testInstance.add('C').then((_tx) => ++size)
    assert.equal(toAscii(await testInstance.last.call()), 'C')
    testInstance.add('D').then((_tx) => ++size)
    assert.equal(toAscii(await testInstance.last.call()), 'D')
    testInstance.add('E').then((_tx) => ++size)
    assert.equal(toAscii(await testInstance.last.call()), 'E')
  })

  it('test indexOf', async () => {
    testInstance.indexOf.call('A').then((_index) => assert.equal(_index, 0))
    testInstance.indexOf.call('B').then((_index) => assert.equal(_index, 1))
    testInstance.indexOf.call('C').then((_index) => assert.equal(_index, 2))
    testInstance.indexOf.call('D').then((_index) => assert.equal(_index, 3))
    testInstance.indexOf.call('E').then((_index) => assert.equal(_index, 4))
  })

  it('test remove, first', async () => {
    assert.equal(toAscii(await testInstance.first.call()), 'A')
    testInstance.remove('A').then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal(toAscii(await testInstance.first.call()), 'E')
    testInstance.remove('E').then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal(toAscii(await testInstance.first.call()), 'D')
    testInstance.remove('D').then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal(toAscii(await testInstance.first.call()), 'C')
    testInstance.remove('C').then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
    assert.equal(toAscii(await testInstance.first.call()), 'B')
    testInstance.remove('B').then((_tx) => --size)
    assert.equal(await testInstance.size.call(), size)
  })

  it('test add, remove, contains', async () => {
    testInstance.add('F').then((_tx) => ++size)
    testInstance.add('G').then((_tx) => ++size)
    testInstance.add('H').then((_tx) => ++size)
    testInstance.add('I').then((_tx) => ++size)
    testInstance.add('J').then((_tx) => ++size)
    assert.equal(await testInstance.contains.call('F'), true)
    assert.equal(await testInstance.contains.call('G'), true)
    assert.equal(await testInstance.contains.call('H'), true)
    assert.equal(await testInstance.contains.call('I'), true)
    assert.equal(await testInstance.contains.call('J'), true)
    testInstance.remove('J').then((_tx) => --size)
    testInstance.remove('I').then((_tx) => --size)
    testInstance.remove('H').then((_tx) => --size)
    assert.equal(await testInstance.contains.call('H'), false)
    assert.equal(await testInstance.contains.call('I'), false)
    assert.equal(await testInstance.contains.call('J'), false)
  })

  it('test get, set', async () => {
    await testInstance.set(0, 'A')
    testInstance.get.call(0).then((_value) => assert.equal(toAscii(_value), 'A'))
    await testInstance.set(1, 'A')
    testInstance.get.call(1).then((_value) => assert.equal(toAscii(_value), 'G'))
  })

  function toAscii(value) {
    return web3.toAscii(value).replace(/\u0000/g, '')
  }
})
