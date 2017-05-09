pragma solidity ^0.4.8;
import './zeppelin/lifecycle/Killable.sol';

contract EventStore is Killable {

  event SOLIDITY_EVENT_PROPERTY(
    uint EventIndex,
    uint EventPropertyIndex,
    string Name,
    string Type,
    address AddressValue,
    uint UIntValue,
    string StringValue
  );

  event SOLIDITY_EVENT(
    uint Id,
    string Type,
    uint Created,
    uint PropertyCount,
    string IntegrityHash
  );

  struct SolidityEventProperty {
    string Name;
    string Type;
    address AddressValue;
    uint UIntValue;
    string StringValue;
  }

  struct SolidityEvent {
    uint Id;
    string Type;
    uint Created;
    uint PropertyCount;
    mapping (uint => SolidityEventProperty) PropertyValues;
    string IntegrityHash;
  }

  uint public solidityEventCount;
  mapping (uint => SolidityEvent) solidityEvents;


  function () payable {}
  function EventStore() payable {}

  function getVersion() public constant
    returns (uint)
  {
    return 1;
  }

  function writeSolidityEventProperty(uint _eventIndex, uint _eventPropertyIndex, string _name, string _type, address _address, uint _uint, string _string) public
    returns (uint)
  {
    solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex] = SolidityEventProperty({
      Name: _name,
      Type: _type,
      AddressValue: _address,
      UIntValue: _uint,
      StringValue: _string
    });
    SOLIDITY_EVENT_PROPERTY(_eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string);
    return solidityEventCount;
  }

   function writeSolidityEvent(string _type, uint _propCount, string _integrity) public
    returns (uint)
  {
    uint _created = now;

    solidityEvents[solidityEventCount] = SolidityEvent({
      Id: solidityEventCount,
      Type: _type,
      Created: _created,
      PropertyCount: _propCount,
      IntegrityHash: _integrity,
    });

    SOLIDITY_EVENT(solidityEventCount, _type, _created, _propCount, _integrity);
    solidityEventCount += 1;
    return solidityEventCount;
  }

  function readSolidityEventType(uint _eventIndex) public
    returns (string)
  {
    return solidityEvents[_eventIndex].Type;
  }
  function readSolidityEventCreated(uint _eventIndex) public
    returns (uint)
  {
    return solidityEvents[_eventIndex].Created;
  }
  function readSolidityEventPropertyCount(uint _eventIndex) public
    returns (uint)
  {
    return solidityEvents[_eventIndex].PropertyCount;
  }
  function readSolidityEventIntegrityHash(uint _eventIndex) public
    returns (string)
  {
    return solidityEvents[_eventIndex].IntegrityHash;
  }

  function readSolidityEventPropertyName(uint _eventIndex, uint _eventPropertyIndex) public
    returns (string)
  {
    return solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].Name;
  }

  function readSolidityEventPropertyType(uint _eventIndex, uint _eventPropertyIndex) public
    returns (string)
  {
    return solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].Type;
  }

  function readSolidityEventPropertyAddressValue(uint _eventIndex, uint _eventPropertyIndex) public
    returns (address)
  {
    return solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].AddressValue;
  }

  function readSolidityEventPropertyUIntValue(uint _eventIndex, uint _eventPropertyIndex) public
    returns (uint)
  {
    return solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].UIntValue;
  }

  function readSolidityEventPropertyStringValue(uint _eventIndex, uint _eventPropertyIndex) public
    returns (string)
  {
    return solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].StringValue;
  }

}
