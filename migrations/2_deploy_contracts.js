var IndexedEnumerableSetLib = artifacts.require("./IndexedEnumerableSetLib.sol");
var TestIndexedEnumerableSetLib = artifacts.require("./TestIndexedEnumerableSetLib.sol");

module.exports = function(deployer) {
  deployer.deploy(IndexedEnumerableSetLib);
  deployer.link(IndexedEnumerableSetLib, TestIndexedEnumerableSetLib);
  deployer.deploy(TestIndexedEnumerableSetLib);
};
