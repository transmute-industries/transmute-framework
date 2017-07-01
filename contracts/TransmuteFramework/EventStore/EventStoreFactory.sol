pragma solidity ^0.4.11;
import "./EventStore.sol";
import "../SetLib/AddressSet/AddressSetLib.sol";

contract EventStoreFactory is EventStore {
  using AddressSetLib for AddressSetLib.AddressSet;
  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Fallback Function
  function () payable { throw; }

  // Constructor
  function EventStoreFactory()
  payable
  {

  }

  // Modifiers
  modifier checkExistence(address _EventStoreAddress)
  {
    require(EventStoreAddresses.contains(_EventStoreAddress));
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
		EventStore _newEventStore = new EventStore();

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

    writeEvent('ES_CREATED', 'v0', 'Address', address(_newEventStore), 0, '', '');

    return address(_newEventStore);
	}

  function killEventStore(address _address)
    public
    checkExistence(_address)
  {
    // Validate Local State
    require(this.owner() == msg.sender && creatorEventStoreMapping[msg.sender].values.length != 0);

    // Update Local State
    creatorEventStoreMapping[msg.sender].remove(_address);
    EventStoreAddresses.remove(_address);

    // Interact With Other Contracts
    EventStore _eventStore = EventStore(_address);
    _eventStore.kill();

    writeEvent('ES_DESTROYED', 'v0', 'Address', address(_address), 0, '', '');
  }
}
