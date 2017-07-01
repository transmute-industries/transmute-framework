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

  string storeName;
  address public creator;
  uint public timeCreated;


  // FALLBACK
  function () payable { throw; }

  // CONSTRUCTOR
  function EventStore(string _storeName) payable {
     storeName = _storeName;
  }

  // VERSION
  function getVersion()
    public constant
    returns (uint)
  {
    return 1;
  }

  // WRITE EVENT
  function writeEvent(
    bytes32 _eventType, 
    bytes32 _version, 
    bytes32 _valueType, 
    address _addressValue, 
    uint _uintValue, 
    bytes32 _bytes32Value, 
    string _stringValue
    )
    public 
    returns (uint)
  {
    uint _created = now;

    EsEventStruct memory solidityEvent;
    solidityEvent.Id = solidityEventCount;
    solidityEvent.Type = _eventType;
    solidityEvent.Created = _created;
    solidityEvent.TxOrigin = tx.origin;
    solidityEvent.Version = _version;

    solidityEvent.ValueType = _valueType;
    solidityEvent.AddressValue = _addressValue;
    solidityEvent.UIntValue = _uintValue;
    solidityEvent.Bytes32Value = _bytes32Value;
    solidityEvent.StringValue = _stringValue;

    solidityEvents[solidityEventCount] = solidityEvent;

    EsEvent(solidityEventCount, _eventType, _version, _valueType, _addressValue, _uintValue, _bytes32Value, _stringValue, tx.origin, _created);
    solidityEventCount += 1;
    return solidityEventCount;
  }

  // READ EVENT
  function readEvent(uint _eventIndex)
    public constant
    returns (
      uint,    // ID
      bytes32, // TYPE
      bytes32, // Version
      bytes32, // Value Type
      address, // Address Value
      uint,    // UInt Value
      bytes32, // Bytes32 Value
      string,  // String Value
      address, // TX Origin
      uint     // Created
      ){
    EsEventStruct memory solidityEvent = solidityEvents[_eventIndex];
    return (
      solidityEvent.Id, 
      solidityEvent.Type, 
      solidityEvent.Version, 
      solidityEvent.ValueType, 

      solidityEvent.AddressValue, 
      solidityEvent.UIntValue, 
      solidityEvent.Bytes32Value, 
      solidityEvent.StringValue, 

      solidityEvent.TxOrigin, 
      solidityEvent.Created
    );
  }
}
