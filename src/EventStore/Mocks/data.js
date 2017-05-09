import { web3 } from '../../env'
import { Constants } from './constants'

export const transmuteTestEvent = {
  Id: 0,
  Type: Constants.PROJECT_CREATED,
  Name: 'Coral'
}

export const transmuteTestEventStream = [
  {
    Id: 1,
    Type: Constants.PROJECT_JOINED,
    UserAddress: web3.eth.accounts[0],
    UserName: 'Engineer Alice'
  },
  {
    Id: 2,
    Type: Constants.PROJECT_JOINED,
    UserAddress: web3.eth.accounts[1],
    UserName: 'Customer Bob'
  },
  {
    Id: 3,
    Type: Constants.PROJECT_MILESTONE,
    Version: 'Version 0'
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
