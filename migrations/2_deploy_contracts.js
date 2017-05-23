var Ownable = artifacts.require('./TransmuteFramework/zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./TransmuteFramework/zeppelin/lifecycle/Killable.sol')

var StringUtils = artifacts.require("./TransmuteFramework/Utils/StringUtils.sol")

var AddressSetLib = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol")
var AddressSetSpec = artifacts.require("./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol")

var Bytes32SetLib = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetLib.sol")
var Bytes32SetSpec = artifacts.require("./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol")

var UIntSetLib = artifacts.require("./TransmuteFramework/SetLib/UIntSet/UIntSetLib.sol")
var UIntSetSpec = artifacts.require("./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol")

var EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')
var EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')

module.exports = function(deployer) {
  deployer.deploy(StringUtils)

  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)

  deployer.deploy(AddressSetLib)
  deployer.link(AddressSetLib, AddressSetSpec)
  deployer.deploy(AddressSetSpec)

  deployer.deploy(Bytes32SetLib)
  deployer.link(Bytes32SetLib, Bytes32SetSpec)
  deployer.deploy(Bytes32SetSpec)

  deployer.deploy(UIntSetLib)
  deployer.link(UIntSetLib, UIntSetSpec)
  deployer.deploy(UIntSetSpec)

  deployer.link(StringUtils, EventStore)
  deployer.link(AddressSetLib, EventStore)
  deployer.link(Killable, EventStore)
  deployer.deploy(EventStore)

  deployer.link(StringUtils, EventStoreFactory)
  deployer.link(AddressSetLib, EventStoreFactory)
  deployer.link(EventStore, EventStoreFactory)
  deployer.deploy(EventStoreFactory)
}
