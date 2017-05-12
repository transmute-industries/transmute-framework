var Ownable = artifacts.require('./node_modules/transmute-framework/contracts/TransmuteFramework/zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./node_modules/transmute-framework/contracts/TransmuteFramework/zeppelin/lifecycle/Killable.sol')

var IndexedEnumerableSetLib = artifacts.require("./node_modules/transmute-framework/contracts/TransmuteFramework/IndexedEnumerableSetLib.sol");
var TestIndexedEnumerableSetLib = artifacts.require("./node_modules/transmute-framework/contracts/TransmuteFramework/TestIndexedEnumerableSetLib.sol");

var EventStore = artifacts.require('./node_modules/transmute-framework/contracts/TransmuteFramework/EventStore.sol')

const transmuteMigrations = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)

  deployer.deploy(IndexedEnumerableSetLib)
  deployer.link(IndexedEnumerableSetLib, TestIndexedEnumerableSetLib)
  deployer.deploy(TestIndexedEnumerableSetLib)
  deployer.link(TestIndexedEnumerableSetLib, Killable)

  deployer.deploy(EventStore)
}

module.exports = {
    transmuteMigrations
}

// In the client (consumer) migrations.js
// const transmuteMigrations = require('./node_modules/trasmute-framework/module_migrations')
// module.exports = function(deployer) {
//     transmuteMigrations(deployer)
//     //   Your migrations below this line...
// }
