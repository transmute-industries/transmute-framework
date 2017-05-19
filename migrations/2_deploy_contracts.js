var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol')

var Bytes32SetLib = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetLib.sol")
var Bytes32SetSpec = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol")

var AddressSetLib = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol")
var AddressSetSpec = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol")

var IndexedEnumerableSetLib = artifacts.require("./TransmuteFramework/IndexedEnumerableSetLib.sol")
var TestIndexedEnumerableSetLib = artifacts.require("./TransmuteFramework/TestIndexedEnumerableSetLib.sol")

var EventStore = artifacts.require('./EventStore.sol')
var EventStoreFactory = artifacts.require('./EventStoreFactory.sol')


module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)


  deployer.link(Killable, EventStore)
  deployer.deploy(EventStore)

  deployer.deploy(IndexedEnumerableSetLib)
  deployer.link(IndexedEnumerableSetLib, TestIndexedEnumerableSetLib)
  deployer.deploy(TestIndexedEnumerableSetLib)

  deployer.deploy(Bytes32SetLib)
  deployer.link(Bytes32SetLib, Bytes32SetSpec)
  deployer.deploy(Bytes32SetSpec)

  deployer.deploy(AddressSetLib)
  deployer.link(AddressSetLib, AddressSetSpec)
  deployer.deploy(AddressSetSpec)

  deployer.link(AddressSetLib, EventStoreFactory)
  deployer.link(EventStore, EventStoreFactory)
  deployer.deploy(EventStoreFactory)
}
