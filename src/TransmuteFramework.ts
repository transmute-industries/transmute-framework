
import { EventStore } from './EventStore/EventStore'
import { ReadModel } from './EventStore/ReadModel/ReadModel'
import { Factory } from './EventStore/Factory/Factory'
import { Persistence } from './EventStore/Persistence/Persistence'
import { PatchLogic } from './EventStore/ReadModel/PatchLogic/PatchLogic'
import { Permissions, IPermissions } from './EventStore/Permissions/Permissions'
import { TransmuteIpfs, ITransmuteIpfs } from './TransmuteIpfs/TransmuteIpfs'

const Web3 = require('web3')
const contract = require('truffle-contract')
import * as util from 'ethereumjs-util'

let web3

declare var window: any

const accessControlArtifacts = require('../build/contracts/RBAC')
const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')



export interface ITransmuteFrameworkConfig {
  env: string
  aca: any,
  esa: any,
  esfa: any,
  ipfsConfig?: any
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

  TransmuteIpfs: ITransmuteIpfs = TransmuteIpfs
  Persistence = Persistence
  Permissions: IPermissions

  // need to make interfaces for these for type safety...
  ReadModel: any
  Factory: any
  PatchLogic: any

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

      this.AccessControlContract = contract(this.config.aca)
      this.AccessControlContract.setProvider(this.web3.currentProvider)

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

    this.Factory = new Factory(this)
    this.EventStore = new EventStore(this)
    this.ReadModel = new ReadModel(this)
    this.PatchLogic = new PatchLogic(this)
    this.Permissions = new Permissions(this)
    return this
  }

  public sign = (address: string, message_hash: string): Promise<string> => {
  
    return new Promise((resolve, reject) => {
      this.web3.eth.sign(address, message_hash, (err, signature) => {
        if (err) {
          throw err;
        }
        resolve(signature)
        // var r = util.toBuffer(signature.slice(0, 66))
        // var s = util.toBuffer('0x' + signature.slice(66, 130))
        // var v = parseInt(signature.slice(130, 132), 16) + 27
        // // console.log(v)
        // var m = util.toBuffer(message_hash)
        // var pub = util.ecrecover(m, v, r, s)
        // var recovered_address = '0x' + util.pubToAddress(pub).toString('hex')
        // console.log(address, recovered_address)
        // resolve(recovered_address)
      })
    })
  }

  public recover = (address: string, message_hash: string, signature: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      var r = util.toBuffer(signature.slice(0, 66))
      var s = util.toBuffer('0x' + signature.slice(66, 130))
      var v = parseInt(signature.slice(130, 132), 16) + 27
      // console.log(v)
      var m = util.toBuffer(message_hash)
      var pub = util.ecrecover(m, v, r, s)
      var recovered_address = '0x' + util.pubToAddress(pub).toString('hex')
      // console.log(address, recovered_address)
      resolve(recovered_address)
    })
  }

}

export default new TransmuteFramework()

