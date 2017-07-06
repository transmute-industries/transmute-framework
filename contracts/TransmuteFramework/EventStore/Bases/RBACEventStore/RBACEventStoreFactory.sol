pragma solidity ^0.4.11;
// import "./EventStore.sol";
// import "../SetLib/AddressSet/AddressSetLib.sol";

// contract EventStoreFactory is EventStore {
//   using AddressSetLib for AddressSetLib.AddressSet;
//   mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
//   AddressSetLib.AddressSet EventStoreAddresses;

//   // Fallback Function
//   function () payable { throw; }

//   // Constructor
//   function EventStoreFactory()
//   payable
//   {

//   }

//   // Modifiers
//   modifier checkExistence(address _EventStoreAddress)
//   {
//     require(EventStoreAddresses.contains(_EventStoreAddress));
//     _;
//   }

//   // Helper Functions
//   function getEventStoresByCreator()
//     public constant
//     returns (address[])
//   {
//     return creatorEventStoreMapping[msg.sender].values;
//   }

//   function getEventStores()
//     public constant
//     returns (address[])
//   {
//     return EventStoreAddresses.values;
//   }

//   // Interface
// 	function createEventStore()
//     public
//     returns (address)
//   {
//     // Interact With Other Contracts
// 		EventStore _newEventStore = new EventStore();

//     // Update State Dependent On Other Contracts
//     EventStoreAddresses.add(address(_newEventStore));
//     creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

//     writeEvent('ES_CREATED', 'A', bytes32(address(_newEventStore)));

//     return address(_newEventStore);
// 	}

//   function killEventStore(address _address)
//     public
//     checkExistence(_address)
//   {
//     // Validate Local State - Only the Factory owner can destroy stores with this method
//     require(this.owner() == msg.sender);

//     EventStore _eventStore = EventStore(_address);

//     // Update Local State
//     creatorEventStoreMapping[_eventStore.owner()].remove(_address);
//     EventStoreAddresses.remove(_address);

//     _eventStore.kill();

//     writeEvent('ES_DESTROYED', 'A', bytes32(_address));
//   }
// }
