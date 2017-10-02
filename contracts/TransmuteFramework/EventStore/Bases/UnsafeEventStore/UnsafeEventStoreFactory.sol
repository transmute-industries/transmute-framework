pragma solidity ^0.4.13;

import "./UnsafeEventStore.sol";
import "../../../SetLib/AddressSet/AddressSetLib.sol";

contract UnsafeEventStoreFactory is UnsafeEventStore {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Fallback Function
  function () payable { revert(); }

  // Constructor
  function UnsafeEventStoreFactory() payable {}

  // Modifiers
  modifier checkExistence(address _eventStoreAddress)
  {
    require(EventStoreAddresses.contains(_eventStoreAddress));
    _;
  }

  // Helper Functions
  function getEventStoresByCreator()
    public constant
    returns (address[])
  {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores()
    public constant
    returns (address[])
  {
    return EventStoreAddresses.values;
  }

  // Interface
	function createEventStore()
    public
    returns (address)
  {
    // Interact With Other Contracts
		UnsafeEventStore _newEventStore = new UnsafeEventStore();

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

    writeEvent("ES_CREATED", "X", "A", "address", bytes32(address(_newEventStore)));

    return address(_newEventStore);
	}

  function killEventStore(address _address)
    public
    checkExistence(_address)
    onlyOwner()
  {
    UnsafeEventStore _eventStore = UnsafeEventStore(_address);

    // Update Local State
    creatorEventStoreMapping[_eventStore.owner()].remove(_address);
    EventStoreAddresses.remove(_address);

    _eventStore.destroy();

    writeEvent("ES_DESTROYED", "X", "A", "address", bytes32(_address));
  }
}
