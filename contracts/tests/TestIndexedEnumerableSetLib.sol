pragma solidity ^0.4.8;

import '../data-structures/IndexedEnumerableSetLib.sol';
import '../zeppelin/lifecycle/Killable.sol';

contract TestIndexedEnumerableSetLib is Killable {
  using IndexedEnumerableSetLib for IndexedEnumerableSetLib.IndexedEnumerableSet;

  IndexedEnumerableSetLib.IndexedEnumerableSet testSet;

  bytes32 public lastPop;
  bool public lastAdd;
  bool public lastRemove;

  function () payable {}
  function TestIndexedEnumerableSetLib() payable {}

  function get(uint index) public constant
    returns (bytes32)
  {
    return testSet.get(index);
  }

  function getValues() public constant
    returns (bytes32[])
  {
    return testSet.values;
  }

  function set(uint index, bytes32 value) public
    returns (bool)
  {
    return testSet.set(index, value);
  }

  function add(bytes32 value) public
    returns (bool)
  {
    lastAdd = testSet.add(value);
    return lastAdd;
  }

  function remove(bytes32 value) public
    returns (bool)
  {
    lastRemove = testSet.remove(value);
    return lastRemove;
  }

  function pop(uint index) public
    returns (bytes32)
  {
    lastPop = testSet.pop(index);
    return lastPop;
  }

  function first() public constant
    returns (bytes32)
  {
    return testSet.first();
  }

  function last() public constant
    returns (bytes32)
  {
    return testSet.last();
  }

  function indexOf(bytes32 value) public constant
    returns (uint)
  {
    return testSet.indexOf(value);
  }

  function contains(bytes32 value) public constant
    returns (bool)
  {
    return testSet.contains(value);
  }

  function size() public constant
    returns (uint)
  {
    return testSet.size();
  }
}
