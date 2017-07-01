pragma solidity ^0.4.11;
import '../zeppelin/lifecycle/Killable.sol';
import "./EventStoreLib.sol";

contract EventStore is Killable {
  using EventStoreLib for EventStoreLib.EsEventStorage;

  EventStoreLib.EsEventStorage store;

  address public creator;
  uint public timeCreated;

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function EventStore() payable {
    creator = tx.origin;
    timeCreated = now;
  }

  // Modifiers
  modifier isWriteAuthorized()
  {
    require(tx.origin == owner || msg.sender == creator);
    _;
  }

  function writeEvent(
    bytes32 _meta, 
    bytes1 _type,
    bytes32 _data
  ) 
    public 
    isWriteAuthorized
    returns (uint)
  {
    return EventStoreLib.writeEvent(
      store, 
      _meta, 
      _type,
      _data
    );
  }

  // READ EVENT
  function readEvent(uint _eventId) 
    returns (
      uint, 
      address, 
      uint, 
      bytes32, 
      bytes1,
      bytes32
    )
  {
    return EventStoreLib.readEvent(store, _eventId);
  }

  event EsEvent(
    uint Id,
    address TxOrigin,
    uint Created,
    bytes32 Meta,
    bytes1 Type,
    bytes32 Data
  );

}