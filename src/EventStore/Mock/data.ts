import { web3 } from '../../env'
import { Constants } from './constants'

export const transmuteTestEvent = {
  Type: Constants.PROJECT_CREATED,
  Name: 'Coral'
}

export const transmuteTestEventStream = [
  {
    Type: Constants.PROJECT_JOINED,
    UserAddress: web3.eth.accounts[0],
    UserName: 'Engineer Alice'
  },
  {
    Type: Constants.PROJECT_JOINED,
    UserAddress: web3.eth.accounts[1],
    UserName: 'Customer Bob'
  },
  {
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

// OLD Faucet Object
export const faucetObjectSnapshot = {
  address :"0x6cf15ee95c59fcb05ec13204335550c27f69c086",
  balance:"909",
  creator:"0xc133f3d564d78fca77489fabe049124d7deda9d9",
  name:"austin-ethereum",
  timeCreated:1494730461
}

export const JSON_FEED = {
  Pie: require('./JSON_FEED/pie')
}

export const JSON_LD = {
  Invoice: require('./JSON_LD/invoice')
}

export const JSON_SCHEMA = {
  Person: require('./JSON_SCHEMA/person')
}

export const JSON_LOGIC = {
  isPieReadyToEat: require('./JSON_LOGIC/isPieReadyToEat'),
  isInvoicePastDue: require('./JSON_LOGIC/isInvoicePastDue')
}


  
