import { web3 } from '../../env'
import { Constants } from './constants'

export const universalEvent = {
    Id: 0,
    Type: 'MESHPOINT_CREATED',
    Name: 'Coral',
    LocationPointer: 'firebase/location/pointer/0',
    IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689'
}

export const universalEvents = [
    {
        Id: 1,
        Type: 'MESHPOINT_FIRMWARE_UPDATE',
        Version: '0.1.3',
        FirmwarePointer: 'firebase/firmware/pointer/1',
        IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689'
    },
    {
        Id: 2,
        Type: 'MESHPOINT_PEER_AUTHORIZATION',
        PeerAddress: '0xadb4966858672ef5ed70894030526544f9a5acdd',
        AuthorizationPointer: 'firebase/authorization/pointer/2',
        IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689'
    }
]

export const transmuteTestEvent = {
  Id: 0,
  Type: Constants.PROJECT_CREATED,
  AddressValue: web3.eth.accounts[0],
  UIntValue: 1,
  StringValue: 'Coral'
}

export const transmuteTestEventStream = [
  {
    Id: 1,
    Type: Constants.PROJECT_JOINED,
    AddressValue: web3.eth.accounts[0],
    UIntValue: 1,
    StringValue: 'Engineer Alice'
  },
  {
    Id: 2,
    Type: Constants.PROJECT_JOINED,
    AddressValue: web3.eth.accounts[1],
    UIntValue: 1,
    StringValue: 'Customer Bob'
  },
  {
    Id: 3,
    Type: Constants.PROJECT_MILESTONE,
    AddressValue: web3.eth.accounts[0],
    UIntValue: 1,
    StringValue: 'Version 0'
  }
]

export const expectedProjectState = {
  ReadModelStoreKey: '0', // CONTRACT_ADDRESS:READ_MODEL_NAME
  ReadModelType: 'ProjectSummary', // READ_MODEL_NAME
  ContractAddress: '', // CONTRACT_ADDRESS
  Name: 'Coral',
  Users: ['Engineer Alice', 'Customer Bob'],
  Milestones: ['Version 0']
}
