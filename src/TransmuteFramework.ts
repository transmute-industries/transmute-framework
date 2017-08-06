
import { EventStore } from './EventStore/EventStore'
import { ReadModel } from './EventStore/ReadModel/ReadModel'
import { Factory } from './EventStore/Factory/Factory'
import { Persistence } from './EventStore/Persistence/Persistence'
import { PatchLogic } from './EventStore/ReadModel/PatchLogic/PatchLogic'
import { Permissions, IPermissions } from './EventStore/Permissions/Permissions'
import { TransmuteIpfs, ITransmuteIpfs } from './TransmuteIpfs/TransmuteIpfs'
import { Toolbox } from './Toolbox/Toolbox'
const Web3 = require('web3')
const contract = require('truffle-contract')

let web3

declare var window: any

const accessControlArtifacts = require('../build/contracts/RBAC')
const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')


var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");



export interface ITransmuteFrameworkConfig {
  env: string
  aca: any,
  esa: any,
  esfa: any,
  ipfsConfig?: any,
  wallet?: any
}
const config = <any>{
  env: 'testrpc',
  aca: accessControlArtifacts,
  esa: eventStoreArtifacts,
  esfa: eventStoreFactoryArtifacts,
}

export interface ITransmuteFramework {
  AccessControlContract: any,
  EventStoreFactoryContract: any,
  EventStoreContract: any,
  EventStore: any,
  Toolbox: any,
  init: (confObj?: any) => any,
  config: any,
  web3: any,
  TransmuteIpfs: any,
  Persistence: any,
  ReadModel: any,
  Factory: any
}

export class TransmuteFramework implements ITransmuteFramework {

  AccessControlContract = null
  EventStoreFactoryContract = null
  EventStoreContract = null
  EventStore: any = null
  config = config
  web3 = null
  engine = null;

  TransmuteIpfs: ITransmuteIpfs = TransmuteIpfs
  Persistence = Persistence
  Permissions: IPermissions
  Toolbox = null

  // need to make interfaces for these for type safety...
  ReadModel: any
  Factory: any
  PatchLogic: any

  public init = (confObj = config) => {
    this.config = confObj

    // testrpc parity infura metamask
    let providerUrl = 'http://localhost:8545'

    if (this.config.env === 'infura') {
      providerUrl = 'https://ropsten.infura.io'
    }

    this.engine = new ProviderEngine();
    // Not sure about the security of this... seems dangerous...
    if (this.config.wallet) {
      this.engine.addProvider(new WalletSubprovider(this.config.wallet, {}));
    }
    this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
    this.engine.start(); // Required by the provider engine.
    var web3 = new Web3(this.engine)

    this.web3 = web3

    if (this.config.env === 'metamask') {
      this.web3 = window.web3;
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
    this.initAll();
    return this
  }

  initAll = () => {

    let ipfsConfig = this.config.ipfsConfig || {
      host: 'localhost',
      port: '5001',
      options: {
        protocol: 'http'
      }
    }
    // This is initialized like so because it can be useful outside framework...
    this.TransmuteIpfs = TransmuteIpfs.init(ipfsConfig)
    this.Factory = new Factory(this)
    this.EventStore = new EventStore(this)
    this.ReadModel = new ReadModel(this)
    this.PatchLogic = new PatchLogic(this)
    this.Permissions = new Permissions(this)
    this.Toolbox = new Toolbox(this)
  }

  getAccounts = () => {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, addresses) => {
        if (err) {
          reject(err);
        } else {
          // console.log('addresses: ', addresses)
          resolve(addresses);
        }
      })
    })

  }

}

export default new TransmuteFramework()

