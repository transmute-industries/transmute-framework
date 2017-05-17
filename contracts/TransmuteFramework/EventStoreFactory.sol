pragma solidity ^0.4.8;
import "./EventStore.sol";
import "./IndexedEnumerableSetLib.sol";

contract EventStoreFactory is EventStore {
  using IndexedEnumerableSetLib for IndexedEnumerableSetLib.IndexedEnumerableSet;

  mapping (address => address) creatorEventStoreMapping;
  IndexedEnumerableSetLib.IndexedEnumerableSet EventStoreAddresses;

  // Fallback Function
  function() payable {}

  // Constructor
  function EventStoreManager() payable {}

  // Modifiers
  modifier checkExistence(address _EventStoreAddress) {
    if (!EventStoreAddresses.contains(_EventStoreAddress))
      throw;
    _;
  }

  // Helper Functions
  function getEventStoreByCreator() constant
    returns (address)
  {
    return creatorEventStoreMapping[msg.sender];
  }

  function getEventStores() constant
    returns (address[])
  {
    return EventStoreAddresses.values;
  }

  // Interface
	function createEventStore() payable
    returns (address)
  {
    // Validate Local State
    if (creatorEventStoreMapping[msg.sender] != 0) {
      throw;
    }

    // Update Local State

    // Interact With Other Contracts
		EventStore _newEventStore = new EventStore();
    if (!_newEventStore.send(msg.value)) {
      throw;
    }

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender] = address(_newEventStore);

    // Emit Events
    // USE EVENT STORE
    // requestAccess(address(_newEventStore), msg.sender);
    // authorizeAccess(address(_newEventStore), msg.sender);
    return address(_newEventStore);
	}

  function killEventStore(address _address, string _name, address _creator)  {
    // Validate Local State
    if ((_creator != msg.sender && this.owner() != msg.sender) || creatorEventStoreMapping[_creator] == 0) {
      throw;
    }

    // Update Local State
    delete creatorEventStoreMapping[_creator];
    EventStoreAddresses.remove(_address);

    // Interact With Other Contracts
    EventStore _EventStore = EventStore(_address);
    _EventStore.kill();

    // Emit Events
    // USE EVENT STORE
  }
}