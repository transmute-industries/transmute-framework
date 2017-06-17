pragma solidity ^0.4.11;
import './zeppelin/lifecycle/Killable.sol';
import "./SetLib/AddressSet/AddressSetLib.sol";

contract EventStore is Killable {
  using AddressSetLib for AddressSetLib.AddressSet;

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
    bool IsAuthorized;
    bytes32 PermissionDomain;
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

  AddressSetLib.AddressSet ACLAddresses;

  mapping (address => mapping (bytes32 => ACL)) ACLMapping;
  struct ACL {
    bool read;
    bool write;
  }

  address public creator;
  uint public timeCreated;

  // Modifiers
  modifier onlyReadAuthorized(bool _isAuthorizedEvent, bytes32 _permissionDomain) {
    require(!_isAuthorizedEvent || (ACLAddresses.contains(tx.origin) && ACLMapping[tx.origin][_permissionDomain].read));
    _;
  }

  modifier onlyWriteAuthorized(bool _isAuthorizedEvent, bytes32 _permissionDomain) {
    require(!_isAuthorizedEvent || (ACLAddresses.contains(tx.origin) && ACLMapping[tx.origin][_permissionDomain].write));
    _;
  }

  modifier onlyReadAndWriteAuthorized(bool _isAuthorizedEvent, bytes32 _permissionDomain) {
    require(!_isAuthorizedEvent || (ACLAddresses.contains(tx.origin) && ACLMapping[tx.origin][_permissionDomain].write && ACLMapping[tx.origin][_permissionDomain].read));
    _;
  }

  modifier isACLAddress(address _ACLAddress) {
    require(ACLAddresses.contains(_ACLAddress));
    _;
  }

  // FALLBACK
  function () { throw; }

  // CONSTRUCTOR
  function EventStore() {}

  // VERSION
  function getVersion()
    public constant
    returns (uint)
  {
    return 1;
  }

  // ACCESS CONTROL
  function getACLAddresses()
    public constant
    returns (address[])
  {
    return ACLAddresses.values;
  }

  function addACLAddress(bytes32 _eventType, bytes32 _readEventType, bytes32 _writeEventType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _ACLAddress)
    public
  {
    require(!ACLAddresses.contains(_ACLAddress));
    ACLAddresses.add(_ACLAddress);
    ACLMapping[_ACLAddress][_permissionDomain] = ACL(false, false);

    writeEvent(_eventType, 'v0', 'Address', _isAuthorizedEvent, _permissionDomain, _ACLAddress, 0, '', '');

    if (_readEventType != '')
      grantReadAccess(_readEventType, _isAuthorizedEvent, _permissionDomain, _ACLAddress);
    if (_writeEventType != '')
      grantWriteAccess(_writeEventType, _isAuthorizedEvent, _permissionDomain, _ACLAddress);
  }

  function grantReadAccess(bytes32 _eventType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _ACLAddress)
    public isACLAddress(_ACLAddress)
  {
    require(!ACLMapping[_ACLAddress][_permissionDomain].read);
    ACL storage updatedACL = ACLMapping[_ACLAddress][_permissionDomain];
    updatedACL.read = true;

    writeEvent(_eventType, 'v0', 'Address', _isAuthorizedEvent, _permissionDomain, _ACLAddress, 0, '', '');
  }

  function revokeReadAccess(bytes32 _eventType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _ACLAddress)
    public isACLAddress(_ACLAddress)
  {
    require(ACLMapping[_ACLAddress][_permissionDomain].read);
    ACL storage updatedACL = ACLMapping[_ACLAddress][_permissionDomain];
    updatedACL.read = false;

    writeEvent(_eventType, 'v0', 'Address', _isAuthorizedEvent, _permissionDomain, _ACLAddress, 0, '', '');
  }

  function grantWriteAccess(bytes32 _eventType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _ACLAddress)
    public isACLAddress(_ACLAddress)
  {
    require(!ACLMapping[_ACLAddress][_permissionDomain].write);
    ACL storage updatedACL = ACLMapping[_ACLAddress][_permissionDomain];
    updatedACL.write = true;

    writeEvent(_eventType, 'v0', 'Address', _isAuthorizedEvent, _permissionDomain, _ACLAddress, 0, '', '');
  }

  function revokeWriteAccess(bytes32 _eventType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _ACLAddress)
    public isACLAddress(_ACLAddress)
  {
    require(ACLMapping[_ACLAddress][_permissionDomain].write);
    ACL storage updatedACL = ACLMapping[_ACLAddress][_permissionDomain];
    updatedACL.write = false;

    writeEvent(_eventType, 'v0', 'Address', _isAuthorizedEvent, _permissionDomain, _ACLAddress, 0, '', '');
  }

  // WRITE EVENT
  function writeEvent(bytes32 _eventType, bytes32 _version, bytes32 _valueType, bool _isAuthorizedEvent, bytes32 _permissionDomain, address _addressValue, uint _uintValue, bytes32 _bytes32Value, string _stringValue)
    public onlyWriteAuthorized(_isAuthorizedEvent, _permissionDomain)
    returns (uint)
  {
    uint _created = now;

    EsEventStruct memory solidityEvent;
    solidityEvent.Id = solidityEventCount;
    solidityEvent.Type = _eventType;
    solidityEvent.Created = _created;
    solidityEvent.IsAuthorized = _isAuthorizedEvent;
    solidityEvent.PermissionDomain = _permissionDomain;
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
    returns (uint, bytes32, bytes32, bytes32, address, uint, bytes32, string, address, uint)
  {
    EsEventStruct memory solidityEvent = solidityEvents[_eventIndex];
    require(!solidityEvent.IsAuthorized || (ACLAddresses.contains(tx.origin) && ACLMapping[tx.origin][solidityEvent.PermissionDomain].read));

    return (solidityEvent.Id, solidityEvent.Type, solidityEvent.Version, solidityEvent.ValueType, solidityEvent.AddressValue, solidityEvent.UIntValue, solidityEvent.Bytes32Value, solidityEvent.StringValue, solidityEvent.TxOrigin, solidityEvent.Created);
  }
}
