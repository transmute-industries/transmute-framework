// var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var TestIndexedEnumerableSetLib = artifacts.require('./TransmuteFramework/TestIndexedEnumerableSetLib.sol')

contract('TestIndexedEnumerableSetLib', function (accounts) {

  var testInstance = null
  var size = 0

  it('test deployed', (done) => {
    TestIndexedEnumerableSetLib.deployed().then((_instance) => {
      testInstance = _instance
      done()
    })
  })

  it('test add, last', (done) => {
    testInstance.add('A').then((_tx) => ++size)
    testInstance.last.call().then((_last) => assert.equal(toAscii(_last), 'A'))
    testInstance.add('B').then((_tx) => ++size)
    testInstance.add('C').then((_tx) => ++size)
    testInstance.add('D').then((_tx) => ++size)
    testInstance.add('E').then((_tx) => ++size)
    testInstance.last.call().then((_last) => assert.equal(toAscii(_last), 'E'))
    done()
  })

  it('test indexOf', (done) => {
    testInstance.indexOf.call('A').then((_index) => assert.equal(_index, 0))
    testInstance.indexOf.call('B').then((_index) => assert.equal(_index, 1))
    testInstance.indexOf.call('C').then((_index) => assert.equal(_index, 2))
    testInstance.indexOf.call('D').then((_index) => assert.equal(_index, 3))
    testInstance.indexOf.call('E').then((_index) => assert.equal(_index, 4))
    done()
  })

  it('test remove, first', (done) => {
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    testInstance.first.call().then((_first) => assert.equal(toAscii(_first), 'A'))
    testInstance.remove('A').then((_tx) => --size)
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    testInstance.first.call().then((_first) => assert.equal(toAscii(_first), 'E'))
    testInstance.remove('E').then((_tx) => --size)
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    testInstance.first.call().then((_first) => assert.equal(toAscii(_first), 'D'))
    testInstance.remove('D').then((_tx) => --size)
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    testInstance.first.call().then((_first) => assert.equal(toAscii(_first), 'C'))
    testInstance.remove('C').then((_tx) => --size)
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    testInstance.first.call().then((_first) => assert.equal(toAscii(_first), 'B'))
    testInstance.remove('B').then((_tx) => --size)
    testInstance.size.call().then((_size) => assert.equal(_size, size))
    done()
  })

  it('test add, remove, contains', (done) => {
    testInstance.contains.call('H').then((_bool) => assert.equal(_bool, false))
    testInstance.add('F').then((_tx) => ++size)
    testInstance.add('G').then((_tx) => ++size)
    testInstance.add('H').then((_tx) => ++size)
    testInstance.add('I').then((_tx) => ++size)
    testInstance.add('J').then((_tx) => ++size)
    testInstance.contains.call('H').then((_bool) => assert.equal(_bool, true))
    testInstance.contains.call('I').then((_bool) => assert.equal(_bool, true))
    testInstance.remove('J').then((_tx) => --size)
    testInstance.remove('I').then((_tx) => --size)
    testInstance.remove('H').then((_tx) => --size)
    testInstance.contains.call('I').then((_bool) => assert.equal(_bool, false))
    done()
  })

  it('test get, set', (done) => {
    testInstance.set(0, 'A');
    testInstance.get.call(0).then((_value) => assert.equal(toAscii(_value), 'A'))
    testInstance.set(1, 'A');
    testInstance.get.call(1).then((_value) => assert.equal(toAscii(_value), 'G'))
    done()
  })

  function toAscii(value) {
    return web3.toAscii(value).replace(/\u0000/g, '')
  }
})