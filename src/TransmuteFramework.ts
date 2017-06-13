
import { EventStore } from './EventStore/EventStore'

import { TransmuteIpfs, ITransmuteIpfs } from './TransmuteIpfs/TransmuteIpfs'

const Web3 = require('web3')
const contract = require('truffle-contract')

let web3

declare var window: any

const eventStoreArtifacts = require('../build/contracts/EventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/EventStoreFactory')

const config = <any>{
  env: 'testrpc',
  esa: eventStoreArtifacts,
  esfa: eventStoreFactoryArtifacts,
}

export interface ITransmuteFramework {
  EventStoreFactoryContract: any,
  EventStoreContract: any,
  EventStore: any,
  init: (confObj?: any) => any,
  config: any,
  web3: any
}

export class TransmuteFramework implements ITransmuteFramework {

  EventStoreFactoryContract = null
  EventStoreContract = null
  EventStore = EventStore
  config = config
  web3 = null

  TransmuteIpfs: ITransmuteIpfs = TransmuteIpfs

  public init = (confObj = config) => {
    this.config = confObj
    switch (this.config.env) {
      case 'testrpc': web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); break
      case 'parity': web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); break
      case 'infura': web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io')); break
      case 'metamask': web3 = window.web3; break
    }
    this.web3 = web3
    if (this.web3) {
      this.EventStoreFactoryContract = contract(this.config.esfa)
      this.EventStoreFactoryContract.setProvider(this.web3.currentProvider)
      this.EventStoreContract = contract(this.config.esa)
      this.EventStoreContract.setProvider(this.web3.currentProvider)
    } else {
      console.warn('web3 is not available, install metamask.')
    }
    return this
  }

}

export default new TransmuteFramework()

