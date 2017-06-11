pragma solidity ^0.4.8;
import "./EventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";
import "./Utils/StringUtils.sol";

contract EventStoreFactory is EventStore {
  using AddressSetLib for AddressSetLib.AddressSet;
  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Fallback Function
  function() payable {}

  // Constructor
  function EventStoreFactory() payable {
    writeEvent('FACTORY_CREATED', 'v0', 'Address', tx.origin, 0, '', '', 0);
  }

  // Modifiers
  modifier checkExistence(address _EventStoreAddress) {
    if (!EventStoreAddresses.contains(_EventStoreAddress))
      throw;
    _;
  }

  // Helper Functions
  function getEventStoresByCreator() constant
    returns (address[])
  {
    return creatorEventStoreMapping[msg.sender].values;
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
    // Interact With Other Contracts
		EventStore _newEventStore = new EventStore();

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

    writeEvent('FACTORY_EVENT_STORE_CREATED', 'v0', 'Address', address(_newEventStore), 0, '', '', 0);
    return address(_newEventStore);
	}

  function killEventStore(address _address) checkExistence(_address) {
    // Validate Local State
    if (this.owner() != msg.sender || creatorEventStoreMapping[msg.sender].values.length == 0) {
      throw;
    }

    // Update Local State
    creatorEventStoreMapping[msg.sender].remove(_address);
    EventStoreAddresses.remove(_address);

    // Interact With Other Contracts
    EventStore _eventStore = EventStore(_address);
    _eventStore.kill();

    writeEvent('FACTORY_EVENT_STORE_DESTROYED', 'v0', 'Address', address(_address), 0, '', '', 0);
  }
}