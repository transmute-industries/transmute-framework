var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol')
var IndexedEnumerableSetLib = artifacts.require("./IndexedEnumerableSetLib.sol");
var TestIndexedEnumerableSetLib = artifacts.require("./TestIndexedEnumerableSetLib.sol");
var EventStore = artifacts.require('./EventStore.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)
  deployer.deploy(IndexedEnumerableSetLib)
  deployer.link(IndexedEnumerableSetLib, TestIndexedEnumerableSetLib)
  deployer.deploy(TestIndexedEnumerableSetLib)
  deployer.link(TestIndexedEnumerableSetLib, Killable)
  deployer.deploy(EventStore)
}
