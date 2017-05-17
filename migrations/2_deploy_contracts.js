var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol')
var IndexedEnumerableSetLib = artifacts.require("./IndexedEnumerableSetLib.sol");
var EventStore = artifacts.require('./EventStore.sol')
var EventStoreFactory = artifacts.require('./EventStoreFactory.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)
  deployer.deploy(IndexedEnumerableSetLib)

  deployer.link(Killable, EventStore)
  deployer.deploy(EventStore)

  deployer.link(IndexedEnumerableSetLib, EventStoreFactory)
  deployer.link(EventStore, EventStoreFactory)
  deployer.deploy(EventStoreFactory)
}
