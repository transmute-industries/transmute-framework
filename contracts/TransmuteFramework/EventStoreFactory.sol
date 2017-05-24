pragma solidity ^0.4.8;
import "./EventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";
import "./Utils/StringUtils.sol";

contract EventStoreFactory is EventStore {
  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => address) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Fallback Function
  function() payable {}

  // Constructor
  function EventStoreFactory() payable {}

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

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender] = address(_newEventStore);

    writeSolidityEvent('EVENT_STORE_CREATED', 1, StringUtils.uintToBytes(solidityEventCount));
    writeSolidityEventProperty(solidityEventCount, 0, 'ContractAddress', 'Address', address(_newEventStore), 0, '');
    writeSolidityEventProperty(solidityEventCount, 1, 'ContractOwnerAddress', 'Address', msg.sender, 0, '');

    return address(_newEventStore);
	}

  function killEventStore(address _address)  {
    // Validate Local State
    if (this.owner() != msg.sender || creatorEventStoreMapping[msg.sender] == 0) {
      throw;
    }

    // Update Local State
    delete creatorEventStoreMapping[msg.sender];
    EventStoreAddresses.remove(_address);

    // Interact With Other Contracts
    EventStore _eventStore = EventStore(_address);
    _eventStore.kill();

    writeSolidityEvent('EVENT_STORE_DESTROYED', 1, StringUtils.uintToBytes(solidityEventCount));
    writeSolidityEventProperty(solidityEventCount, 0, 'ContractAddress', 'Address', _address, 0, '');
  }
}
