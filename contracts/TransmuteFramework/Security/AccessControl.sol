pragma solidity ^0.4.11;

import "../EventStore/EventStoreLib.sol";
import "../SetLib/Bytes32Set/Bytes32SetLib.sol";
import '../zeppelin/lifecycle/Killable.sol';

contract AccessControl is Killable {

  using Bytes32SetLib for Bytes32SetLib.Bytes32Set;
  using EventStoreLib for EventStoreLib.EsEventStorage;

  EventStoreLib.EsEventStorage store;

  struct Grant {
    bytes32 role;
    bytes32 resource;
    bytes32 action;
    bytes32[] attributes;
  }

  Grant[] grants;

  Bytes32SetLib.Bytes32Set internalEventTypes;

  mapping(address => bytes32) addressRole;

  event DEBUG (
    bool test
  );

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function AccessControl() payable {
    internalEventTypes.add(bytes32('ES_ROLE_ASSIGNED'));
    internalEventTypes.add(bytes32('ES_GRANT_WRITTEN'));
  }

   modifier canSetGrant(bytes32 resource, bytes32 action)
  {
    // only the owner can setGrants to the grant resource (no write up)
    // just because an account can setGrants does not mean they can give that ability to others...
    if (resource == 'grant') {
      require(tx.origin == owner);
    }
    if (tx.origin == owner) {
      _;
    } else {
      bytes32 role = addressRole[tx.origin];
      bool granted = canRoleActionResourceGranted(role, action, resource);
      // DEBUG(granted);
      if(granted){
        _;
      } else {
        throw;
      }
    }
    // throw;
    // require(tx.origin == owner);
    // _;
  }

  function setAddressRole(address target, bytes32 role)
  public
  onlyOwner
  {
    addressRole[target] = role;
    writeEvent('ES_ROLE_ASSIGNED', 'A', 'X', bytes32(target), role);
  }

  function getAddressRole(address target)
  public
  onlyOwner
  returns (bytes32)
  {
    return addressRole[target];
  }
  
  function grantCount() 
  returns (uint)
  {
    return grants.length;
  }

  function setGrant(bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes)
    public
    canSetGrant(resource, action)
  {
    Grant memory grant;
    grant.role = role;
    grant.resource = resource;
    grant.action = action;
    grant.attributes = attributes;

    grants.push(grant);
    GrantEvent(role, resource, action, attributes);
    writeEvent('ES_GRANT_WRITTEN', 'X', 'U', 'index', bytes32(grants.length-1));
  }

  function getGrant(uint index)
  returns (bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes)
  {
    Grant memory grant = grants[index];
    return (grant.role, grant.resource, grant.action, grant.attributes);
  }

  // To be optimized later...
  function canRoleActionResource(bytes32 role, bytes32 action, bytes32 resource)
  returns (bool, bytes32, bytes32, bytes32[])
  {
    bool isLastAttributesNonEmpty = false;
    Grant memory grant;
    // pretty sure a hash map can eliminate this...
    for (uint index = 0; index < grants.length; index++) {
      grant = grants[index];
      if (grant.role == role && grant.action == action && grant.resource == resource){
        isLastAttributesNonEmpty = grant.attributes.length != 0;
      }
    }

    // Make sure we return [] for granted == false
    bytes32[] memory attrs;
    if (isLastAttributesNonEmpty){
      attrs = grant.attributes;
    }
    return (isLastAttributesNonEmpty, role, resource, attrs);
  }

  // When we only care about the boolean...
  function canRoleActionResourceGranted(bytes32 role, bytes32 action, bytes32 resource)
  internal
  returns (bool)
  {
    bool isLastAttributesNonEmpty = false;
    Grant memory grant;
    // pretty sure a hash map can eliminate this...
    for (uint index = 0; index < grants.length; index++) {
      grant = grants[index];
      if (grant.role == role && grant.action == action && grant.resource == resource){
        isLastAttributesNonEmpty = grant.attributes.length != 0;
      }
    }

    return (isLastAttributesNonEmpty);
  }

  function writeEvent(
    bytes32 _eventType, 
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
    internal 
    returns (uint)
  {
    return EventStoreLib.writeEvent(
      store, 
      _eventType, 
      _keyType,
      _valueType,
      _key,
      _value
    );
  }

  // READ EVENT
  function readEvent(uint _eventId) 
    public 
    returns (
      uint, 
      address, 
      uint, 
      bytes32, 
      bytes1,
      bytes1,
      bytes32,
      bytes32
    )
  {
    return EventStoreLib.readEvent(store, _eventId);
  }

  event EsEvent(
    uint Id,
    address TxOrigin,
    uint Created,

    bytes32 EventType,

    bytes1 KeyType,
    bytes1 ValueType,

    bytes32 Key,
    bytes32 Value
  );

  event GrantEvent (
    bytes32 role, 
    bytes32 resource, 
    bytes32 action, 
    bytes32[] attributes
  );

}