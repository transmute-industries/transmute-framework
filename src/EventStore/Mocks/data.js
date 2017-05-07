import { web3 } from '../../env'
import { Constants } from './constants'

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
