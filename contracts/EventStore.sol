pragma solidity ^0.4.8;
import './zeppelin/lifecycle/Killable.sol';

contract EventStore is Killable {

  struct TransmuteEvent {
    uint Id;
    string Type;
    uint Created;
    address AddressValue;
    uint UIntValue;
    string StringValue;
  }

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
  }

  uint public solidityEventCount;
  mapping (uint => SolidityEvent) solidityEvents;

  uint public eventCount;
  mapping (uint => TransmuteEvent) events;

  event SOLIDITY_EVENT(
    uint Id,
    string Type,
    uint Created,
    address PropertyCount
  );

  event NEW_EVENT(
    uint Id,
    string Type,
    uint Created,
    address AddressValue,
    uint UIntValue,
    string StringValue
  );

  function getVersion() public constant
    returns (uint)
  {
    return 1;
  }

  function emitEvent(string _type, address _address, uint _uint, string _string) public
    returns (uint)
  {
    uint _created = now;

    events[eventCount] = TransmuteEvent({
      Id: eventCount,
      Type: _type,
      Created: _created,
      AddressValue: _address,
      UIntValue: _uint,
      StringValue: _string
    });

    NEW_EVENT(eventCount, _type, _created, _address, _uint, _string);
    eventCount += 1;
    return eventCount;
  }

  function getType(uint eventId) public constant
    returns (string)
  {
    return events[eventId].Type;
  }

  function getCreated(uint eventId) public constant
    returns (uint)
  {
    return events[eventId].Created;
  }

  function getAddressValue(uint eventId) public constant
    returns (address)
  {
    return events[eventId].AddressValue;
  }

  function getUIntValue(uint eventId) public constant
    returns (uint)
  {
    return events[eventId].UIntValue;
  }

  function getStringValue(uint eventId) public constant
    returns (string)
  {
    return events[eventId].StringValue;
  }
}
