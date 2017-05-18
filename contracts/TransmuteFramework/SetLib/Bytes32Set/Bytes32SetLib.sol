pragma solidity ^0.4.8;

/// @title Library implementing an array type which allows O(1) lookups on values.
/// @author Piper Merriam <pipermerriam@gmail.com>, Eric Olszewski <eolszewski@gmail.com>
/// Adapted from https://github.com/ethpm/ethereum-indexed-enumerable-set-lib/blob/master/contracts/IndexedEnumerableSetLib.sol
library Bytes32SetLib {

  struct Bytes32Set {
    bytes32[] values;
    mapping(bytes32 => bool) exists;
    mapping(bytes32 => uint) indices;
  }

  modifier inBounds(Bytes32Set storage self, uint index) {
    if (index >= self.values.length)
      throw;
    _;
  }

  modifier notEmpty(Bytes32Set storage self) {
    if (self.values.length == 0)
      throw;
    _;
  }

  function get(Bytes32Set storage self, uint index) public constant
    inBounds(self, index)
    returns (bytes32)
  {
    return self.values[index];
  }

  function set(Bytes32Set storage self, uint index, bytes32 value) public
    inBounds(self, index)
    returns (bool)
  {
    if (self.exists[value])
      return false;
    self.values[index] = value;
    self.exists[value] = true;
    self.indices[value] = index;
    return true;
  }

  function add(Bytes32Set storage self, bytes32 value) public
    returns (bool)
  {
    if (self.exists[value])
      return false;
    self.indices[value] = self.values.length;
    self.values.push(value);
    self.exists[value] = true;
    return true;
  }

  function remove(Bytes32Set storage self, bytes32 value) public
    returns (bool)
  {
    if (!self.exists[value])
      return false;
    uint index = indexOf(self, value);
    pop(self, index);
    return true;
  }

  function pop(Bytes32Set storage self, uint index) public
    inBounds(self, index)
    returns (bytes32)
	{
    bytes32 value = get(self, index);

    if (index != self.values.length - 1) {
      bytes32 lastValue = last(self);
      self.exists[lastValue] = false;
      set(self, index, lastValue);
      self.indices[lastValue] = index;
    }
    self.values.length -= 1;

    delete self.indices[value];
    delete self.exists[value];

    return value;
  }

  function first(Bytes32Set storage self) public constant
    notEmpty(self)
    returns (bytes32)
  {
    return get(self, 0);
  }

  function last(Bytes32Set storage self) public constant
    notEmpty(self)
    returns (bytes32)
  {
    return get(self, self.values.length - 1);
  }

  function indexOf(Bytes32Set storage self, bytes32 value) public constant
    returns (uint)
  {
    if (!self.exists[value])
      return uint(-1);
    return self.indices[value];
  }

  function contains(Bytes32Set storage self, bytes32 value) public constant
    returns (bool)
  {
    return self.exists[value];
  }

  function size(Bytes32Set storage self) public constant
    returns (uint)
  {
    return self.values.length;
  }
}