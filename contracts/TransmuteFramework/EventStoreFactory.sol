pragma solidity ^0.4.8;
import "./EventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";
import "./Utils/StringUtils.sol";

contract EventStoreFactory is EventStore {
  using AddressSetLib for AddressSetLib.AddressSet;

  AddressSetLib.AddressSet EventStoreAddresses;

  // Fallback Function
  function() payable {}

  // Constructor
  function EventStoreFactory() payable {
    uint eventIndex = solidityEventCount;
    writeSolidityEvent('FACTORY_CREATED', 1, '');
    writeSolidityEventProperty(eventIndex, 0, 'ContractOwnerAddress', 'Address', msg.sender, 0, '');
  }

  // Modifiers
  modifier checkExistence(address _EventStoreAddress) {
    if (!EventStoreAddresses.contains(_EventStoreAddress))
      throw;
    _;
  }

  // Helper Functions

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
 

    // Update Local State

    // Interact With Other Contracts
		EventStore _newEventStore = new EventStore();

    // Update State Dependent On Other Contracts
    EventStoreAddresses.add(address(_newEventStore));

    uint eventIndex = solidityEventCount;

    writeSolidityEvent('FACTORY_EVENT_STORE_CREATED', 2, '');
    writeSolidityEventProperty(eventIndex, 0, 'ContractAddress', 'Address', address(_newEventStore), 0, '');
    writeSolidityEventProperty(eventIndex, 1, 'ContractOwnerAddress', 'Address', msg.sender, 0, '');

    return address(_newEventStore);
	}

  function killEventStore(address _address)  {
    // Validate Local State
    if (this.owner() != msg.sender ) {
      throw;
    }

    // Update Local State
    EventStoreAddresses.remove(_address);

    // Interact With Other Contracts
    EventStore _eventStore = EventStore(_address);
    _eventStore.kill();

    uint eventIndex = solidityEventCount;

    writeSolidityEvent('FACTORY_EVENT_STORE_DESTROYED', 1, StringUtils.uintToBytes(eventIndex));
    writeSolidityEventProperty(eventIndex, 0, 'ContractAddress', 'Address', _address, 0, '');
  }
}
