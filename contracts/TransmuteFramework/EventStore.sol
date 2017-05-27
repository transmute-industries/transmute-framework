pragma solidity ^0.4.8;
import './zeppelin/lifecycle/Killable.sol';
import "./SetLib/AddressSet/AddressSetLib.sol";
import "./Utils/StringUtils.sol";

contract EventStore is Killable {
  using AddressSetLib for AddressSetLib.AddressSet;

  struct SolidityEventStruct {
    uint Id;
    bytes32 Type;
    bytes32 Version;

    bytes32 ValueType;
    address AddressValue;
    uint UIntValue;
    bytes32 Bytes32Value;

    address TxOrigin;
    uint Created;
    uint PropertyCount;
    mapping (uint => SolidityEventProperty) PropertyValues;
  }
  event SOLIDITY_EVENT(
    uint Id,
    bytes32 Type,
    bytes32 Version,

    bytes32 ValueType,
    address AddressValue,
    uint UIntValue,
    bytes32 Bytes32Value,

    address TxOrigin,
    uint Created,
    uint PropertyCount
  );

  struct SolidityEventProperty {
    bytes32 Name;
    bytes32 Type;
    address AddressValue;
    uint UIntValue;
    bytes32 Bytes32Value;
  }
  event SOLIDITY_EVENT_PROPERTY(
    uint EventIndex,
    uint EventPropertyIndex,
    bytes32 Name,
    bytes32 Type,
    address AddressValue,
    uint UIntValue,
    bytes32 Bytes32Value
  );

  uint public solidityEventCount;
  mapping (uint => SolidityEvent) solidityEvents;

  mapping (address => bool) authorizedAddressesMapping;
  AddressSetLib.AddressSet requestorAddresses;
  address public creator;
  uint public timeCreated;

  // Modifiers
  modifier onlyCreator() {
    if (tx.origin != creator)
      throw;
    _;
  }

  modifier onlyAuthorized() {
    if (tx.origin != creator && !authorizedAddressesMapping[tx.origin])
      throw;
    _;
  }

  // CONSTRUCTOR
  function () payable {}
  function EventStore() payable {
    creator = tx.origin;
    requestorAddresses.add(creator);
    authorizedAddressesMapping[creator] = true;
  }

  // VERSION
  function getVersion() public constant
    returns (uint)
  {
    return 1;
  }

  // ACCESS CONTROL
  function getRequestorAddresses() constant
    returns (address[])
  {
    return requestorAddresses.values;
  }

  function addRequestorAddress(address _requestor) public {
    if (requestorAddresses.contains(_requestor))
      throw;
    requestorAddresses.add(_requestor);
    authorizedAddressesMapping[_requestor] = false;

    writeEvent('EVENT_STORE_ACCESS_REQUESTED', 'v0', 'Address', _requestor, 0, '', 0);
  }

  function authorizeRequestorAddress(address _requestor) 
    public onlyCreator
  {
    if (!requestorAddresses.contains(_requestor))
      throw;
    if (authorizedAddressesMapping[_requestor])
      throw;
    authorizedAddressesMapping[_requestor] = true;

    writeEvent('EVENT_STORE_ACCESS_GRANTED', 'v0', 'Address', _requestor, 0, '', 0);
  }

  function revokeRequestorAddress(address _requestor) 
    public onlyCreator
  {
    if (!requestorAddresses.contains(_requestor))
      throw;
    if (!authorizedAddressesMapping[_requestor])
      throw;
    authorizedAddressesMapping[_requestor] = false;

     writeEvent('EVENT_STORE_ACCESS_REVOKED', 'v0', 'Address', _requestor, 0, '', 0);
  }

  function isAddressAuthorized(address _address) 
    public constant
    returns (bool)
  {
    return authorizedAddressesMapping[_address];
  }

  // WRITE EVENT
  function writeEvent(bytes32 _type, bytes32 _version, bytes32 _valueType, address _addressValue, uint _uintValue, bytes32 _bytes32Value , uint _propCount) 
    public onlyAuthorized
    returns (uint)
  {
    uint _created = now;

    SolidityEvent memory solidityEvent;
    solidityEvent.Id = solidityEventCount;
    solidityEvent.Type = _type;
    solidityEvent.Created = _created;
    solidityEvent.TxOrigin = tx.origin;
    solidityEvent.Version = _version;

    solidityEvent.ValueType = _valueType;
    solidityEvent.AddressValue = _addressValue;
    solidityEvent.UIntValue = _uintValue;
    solidityEvent.Bytes32Value = _bytes32Value;

    solidityEvent.PropertyCount = _propCount;
    solidityEvents[solidityEventCount] = solidityEvent;

    SOLIDITY_EVENT(solidityEventCount, _type, _version, _valueType, _addressValue, _uintValue, _bytes32Value, tx.origin, _created, _propCount);
    solidityEventCount += 1;
    return solidityEventCount;
  }

  function writeEventProperty(uint _eventIndex, uint _eventPropertyIndex, bytes32 _name, bytes32 _type, address _address, uint _uint, bytes32 _string) 
    public onlyAuthorized
    returns (uint)
  {
    if(solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex].Type != 0){
      throw;
    }
    SolidityEventProperty memory solidityEventProperty;
    solidityEventProperty.Name = _name;
    solidityEventProperty.Type = _type;
    solidityEventProperty.AddressValue = _address;
    solidityEventProperty.UIntValue = _uint;
    solidityEventProperty.Bytes32Value = _string;
    solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex] = solidityEventProperty;

    SOLIDITY_EVENT_PROPERTY(_eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string);
    return solidityEventCount;
  }
  
  // READ EVENT
  function readEvent(uint _eventIndex) 
    public onlyAuthorized 
    returns (uint, bytes32, bytes32, bytes32, address, uint, bytes32, address, uint, uint)
  {
    SolidityEvent memory solidityEvent = solidityEvents[_eventIndex];
    return (solidityEvent.Id, solidityEvent.Type, solidityEvent.Version, solidityEvent.ValueType, solidityEvent.AddressValue, solidityEvent.UIntValue, solidityEvent.Bytes32Value, solidityEvent.TxOrigin, solidityEvent.Created, solidityEvent.PropertyCount);
  }

  function readEventProperty(uint _eventIndex, uint _eventPropertyIndex) 
    public onlyAuthorized
    returns (uint, uint, bytes32, bytes32, address, uint, bytes32)
  {
    SolidityEventProperty memory prop = solidityEvents[_eventIndex].PropertyValues[_eventPropertyIndex];
    return (_eventIndex, _eventPropertyIndex, prop.Name, prop.Type, prop.AddressValue, prop.UIntValue, prop.Bytes32Value);
  }

}
