pragma solidity ^0.4.11;
import '../zeppelin/lifecycle/Killable.sol';

contract EventStore is Killable {

  struct EsEventStruct {
    uint Id;
    bytes32 Type;
    bytes32 Version;

    bytes32 ValueType;
    address AddressValue;
    uint UIntValue;
    bytes32 Bytes32Value;
    string StringValue;

    address TxOrigin;
    uint Created;
  }
  event EsEvent(
    uint Id,
    bytes32 Type,
    bytes32 Version,

    bytes32 ValueType,
    address AddressValue,
    uint UIntValue,
    bytes32 Bytes32Value,
    string StringValue,

    address TxOrigin,
    uint Created
  );

  uint public solidityEventCount;
  mapping (uint => EsEventStruct) solidityEvents;

  address public creator;
  uint public timeCreated;

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function EventStore() payable {
    creator = tx.origin;
    timeCreated = now;
  }

  // WRITE EVENT
  function writeEvent(bytes32 _type, bytes32 _version, bytes32 _valueType, address _addressValue, uint _uintValue, bytes32 _bytes32Value, string _stringValue) 
    returns (uint)
  {
    uint _created = now;

    EsEventStruct memory solidityEvent;
    solidityEvent.Id = solidityEventCount;
    solidityEvent.Type = _type;
    solidityEvent.Created = _created;
    solidityEvent.TxOrigin = tx.origin;
    solidityEvent.Version = _version;

    solidityEvent.ValueType = _valueType;
    solidityEvent.AddressValue = _addressValue;
    solidityEvent.UIntValue = _uintValue;
    solidityEvent.Bytes32Value = _bytes32Value;
    solidityEvent.StringValue = _stringValue;

    solidityEvents[solidityEventCount] = solidityEvent;

    EsEvent(solidityEventCount, _type, _version, _valueType, _addressValue, _uintValue, _bytes32Value, _stringValue, tx.origin, _created);
    solidityEventCount += 1;
    return solidityEventCount;
  }

  // READ EVENT
  function readEvent(uint _eventIndex) 
    returns (uint, bytes32, bytes32, bytes32, address, uint, bytes32, string, address, uint)
  {
    EsEventStruct memory solidityEvent = solidityEvents[_eventIndex];
    return (solidityEvent.Id, solidityEvent.Type, solidityEvent.Version, solidityEvent.ValueType, solidityEvent.AddressValue, solidityEvent.UIntValue, solidityEvent.Bytes32Value, solidityEvent.StringValue, solidityEvent.TxOrigin, solidityEvent.Created);
  }


}