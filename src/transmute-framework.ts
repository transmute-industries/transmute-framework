import { EventStore } from './EventStore/EventStore'
import { ReadModel } from './EventStore/ReadModel/ReadModel'
import { Factory } from './EventStore/Factory/Factory'
import Persistence from './EventStore/Persistence/Persistence'

import { PatchLogic } from './EventStore/ReadModel/PatchLogic/PatchLogic'
import { Permissions, IPermissions } from './EventStore/Permissions/Permissions'
import { TransmuteIpfs, ITransmuteIpfs } from './TransmuteIpfs/TransmuteIpfs'
import { Toolbox } from './Toolbox/Toolbox'
import Firebase from './Toolbox/Firebase'
const Web3 = require('web3')
const contract = require('truffle-contract')

let web3

const accessControlArtifacts = require('../build/contracts/RBAC')
const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')

const ProviderEngine = require('web3-provider-engine')
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js')
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')

export interface ITransmuteFrameworkConfig {
  providerUrl: string
  aca: any
  esa: any
  esfa: any
  TRANSMUTE_API_ROOT: any
  ipfsConfig?: any
  wallet?: any
  firebaseApp?: any
  firebaseAdmin?: any
}
const config: ITransmuteFrameworkConfig = {
  providerUrl: 'http://localhost:8545',
  aca: accessControlArtifacts,
  esa: eventStoreArtifacts,
  esfa: eventStoreFactoryArtifacts,
  TRANSMUTE_API_ROOT: 'http://localhost:3001'
}

export interface ITransmuteFramework {
  AccessControlContract: any
  EventStoreFactoryContract: any
  EventStoreContract: any
  EventStore: any
  Toolbox: any
  init: (confObj?: any) => any
  config: any
  web3: any
  TransmuteIpfs: any
  Persistence: any
  ReadModel: any
  Factory: any
  Firebase?: any
  firebaseApp?: any
  firebaseAdmin?: any
  db?: any
}

declare var window: any

export class TransmuteFramework implements ITransmuteFramework {
  AccessControlContract: any
  EventStoreFactoryContract: any
  EventStoreContract: any
  EventStore: any
  config = config

  version: string = require('../package.json').version

  engine = new ProviderEngine()
  web3 = new Web3(this.engine)

  TransmuteIpfs: ITransmuteIpfs = TransmuteIpfs

  Permissions: IPermissions
  Toolbox: Toolbox

  // need to make interfaces for these for type safety...
  Persistence: any
  ReadModel: any
  Factory: any
  PatchLogic: any

  Firebase?: any

  db?: any

  firebaseApp?: any
  firebaseAdmin?: any

  public initWeb3 = (providerUrl: string) => {
    this.engine = new ProviderEngine()
    // Not sure about the security of this... seems dangerous...
    if (this.config.wallet) {
      this.engine.addProvider(new WalletSubprovider(this.config.wallet, {}))
    }
    this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)))
    this.engine.start() // Required by the provider engine.
    web3 = new Web3(this.engine)
    this.web3 = web3
  }

  public init = (confObj = config) => {
    this.config = confObj
    this.initWeb3(this.config.providerUrl)

    try {
      if (window.web3) {
        console.info('Transmute Framework has detected MetaMask!')
        this.web3 = window.web3
      }
    } catch (e) {
      // probably not in browser... ignore..
    }

    if (this.web3) {
      this.AccessControlContract = contract(this.config.aca)
      this.AccessControlContract.setProvider(this.web3.currentProvider)

      this.EventStoreFactoryContract = contract(this.config.esfa)
      this.EventStoreFactoryContract.setProvider(this.web3.currentProvider)

      this.EventStoreContract = contract(this.config.esa)
      this.EventStoreContract.setProvider(this.web3.currentProvider)
    } else {
      console.warn('web3 is not available, install metamask.')
    }
    this.initAll()
    return this
  }

  initAll = () => {
    let ipfsConfig = this.config.ipfsConfig || {
      host: 'localhost',
      port: '5001',
      options: {
        protocol: 'http',
      },
    }

    if (this.config.firebaseApp) {
      this.firebaseApp = this.config.firebaseApp
      this.db = this.firebaseApp.firestore()
    }

    if (this.config.firebaseAdmin) {
      this.firebaseAdmin = this.config.firebaseAdmin
      this.db = this.firebaseAdmin.firestore()
    }

    // This is initialized like so because it can be useful outside framework...
    this.TransmuteIpfs = TransmuteIpfs.init(ipfsConfig)
    this.Persistence = new Persistence(this)
    this.Factory = new Factory(this)
    this.EventStore = new EventStore(this)
    this.ReadModel = new ReadModel(this)
    this.PatchLogic = new PatchLogic(this)
    this.Permissions = new Permissions(this)
    this.Toolbox = new Toolbox(this)
    this.Firebase = new Firebase(this)
  }

  getAccounts = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err: any, addresses: string[]) => {
        if (err) {
          reject(err)
        } else {
          // console.log('addresses: ', addresses)
          resolve(addresses)
        }
      })
    })
  }
}

export default new TransmuteFramework()
