
import { EventStore } from './EventStore/EventStore'

import { EventTypes } from './EventStore/EventTypes/EventTypes'

import { Persistence } from './EventStore/Persistence/Persistence'

import { TransmuteIpfs, ITransmuteIpfs } from './TransmuteIpfs/TransmuteIpfs'

const Web3 = require('web3')
const contract = require('truffle-contract')

let web3

declare var window: any

const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')

export interface ITransmuteFrameworkConfig {
  env: string
  esa: any,
  esfa: any,
  ipfsConfig?: any
}
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
  web3: any,
  TransmuteIpfs: any,
  Persistence: any
}

export class TransmuteFramework implements ITransmuteFramework {

  EventStoreFactoryContract = null
  EventStoreContract = null
  EventStore: any = null
  config = config
  web3 = null

  TransmuteIpfs: ITransmuteIpfs = TransmuteIpfs
  EventTypes = EventTypes
  Persistence = Persistence

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

    let ipfsConfig = confObj.ipfsConfig || {
      host: 'localhost',
      port: '5001',
      options: {
        protocol: 'http'
      }
    }
    // This is initialized like so because it can be useful outside framework...
    this.TransmuteIpfs = TransmuteIpfs.init(ipfsConfig)
    this.EventStore = new EventStore(this)
    return this
  }

}

export default new TransmuteFramework()

