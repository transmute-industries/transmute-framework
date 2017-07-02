pragma solidity ^0.4.11;
import "../EventStore/EventStore.sol";
import "../SetLib/Bytes32Set/Bytes32SetLib.sol";

contract AccessControl is EventStore {
  using Bytes32SetLib for Bytes32SetLib.Bytes32Set;

  // mapping (address => Bytes32SetLib.Bytes32Set) creatorEventStoreMapping;
  // Bytes32SetLib.Bytes32Set EventStoreAddresses;

  // struct Resource {
  //   mapping(Bytes32 => Action) grants;
  // } 

  // struct Action {
  //   mapping (Bytes32 => Bytes32SetLib.Bytes32Set) attributes;
  // }

  struct GrantListItem {
    bytes32 role;
    bytes32 resource;
    bytes32 action;
    bytes32[] attributes;
  }

  event GrantSet (
    bytes32 role, 
    bytes32 resource, 
    bytes32 action, 
    bytes32[] attributes
  );

  GrantListItem[] grantList;

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function AccessControl() payable {

  }

  function setGrant(bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes){

    GrantListItem memory grant;
    grant.role = role;
    grant.resource = resource;
    grant.action = action;
    grant.attributes = attributes;

    grantList.push(grant);
    GrantSet(role, resource, action, attributes);

  }

  function getGrant(uint index)
  returns (bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes)
  {
    GrantListItem memory grant = grantList[index];
    return (grant.role, grant.resource, grant.action, grant.attributes);
  }

  function canRoleActionResource(bytes32 role, bytes32 action, bytes32 resource)
  returns (bool, bytes32, bytes32, bytes32[])
  {
    bool isLastAttributesNonEmpty = false;
    GrantListItem memory grant;
    // pretty sure a hash map can eliminate this...
    for (uint index = 0; index < grantList.length; index++) {
      grant = grantList[index];
      if (grant.role == role && grant.action == action && grant.resource == resource){
        isLastAttributesNonEmpty = grant.attributes.length != 0;
      }
    }

    // Make sure we return [] for granted == false
    bytes32[] memory attrs;
    if (isLastAttributesNonEmpty){
      attrs = grant.attributes;
    }
    return (isLastAttributesNonEmpty, grant.role, grant.resource, attrs);
  }

}