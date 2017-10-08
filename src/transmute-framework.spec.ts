'use strict'

const contract = require('truffle-contract')

import * as _ from 'lodash'
import { expect, assert, should } from 'chai'

import TransmuteFramework from './transmute-framework'

const accessControlArtifacts = require('../build/contracts/RBAC')
const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')

const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

declare var jest: any

describe('TransmuteFramework', () => {
  describe('.init', () => {
    it('should use testrpc as default web3 provider', async () => {
      TransmuteFramework.init()
      // TODO: add tests here...
      // console.log(TransmuteFramework.Persistence.store)
    })
    it('should support infura ropsten', async () => {
      TransmuteFramework.init({
        providerUrl: 'https://ropsten.infura.io',
        aca: accessControlArtifacts,
        esa: eventStoreArtifacts,
        esfa: eventStoreFactoryArtifacts,
      })
      // TODO: add tests here...
    })

    it('should support HD Lightwallets', async () => {
      const mnemonic = 'couch solve unique spirit wine fine occur rhythm foot feature glory away'
      const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))

      // Get the first account using the standard hd path.
      const walletHDPath = "m/44'/60'/0'/0/"
      const wallet = hdwallet.derivePath(walletHDPath + '0').getWallet()

      TransmuteFramework.init({
        providerUrl: 'https://ropsten.infura.io',
        wallet: wallet,
        aca: accessControlArtifacts,
        esa: eventStoreArtifacts,
        esfa: eventStoreFactoryArtifacts,
      })
    })

    it('should use local ipfs as default ', async () => {
      TransmuteFramework.init()
      assert(TransmuteFramework.TransmuteIpfs.config.host === 'localhost')
    })

    it('should initialize EventStore with config', async () => {
      TransmuteFramework.init()
      assert(TransmuteFramework.EventStore.framework.TransmuteIpfs.config.host === 'localhost')
    })

    it('should support firestore node sdk', async () => {
      jest.setTimeout(30 * 1000)

      const admin = require('firebase-admin')

      admin.initializeApp({
        credential: admin.credential.cert(require('../transmute-framework-ae7ad1443e90.json')),
      })

      const db = admin.firestore()

      let T = TransmuteFramework.init({
        providerUrl: 'http://localhost:8545',
        aca: accessControlArtifacts,
        esa: eventStoreArtifacts,
        esfa: eventStoreFactoryArtifacts,
        db,
      })
      // console.log(TransmuteFramework.config.firebaseConfig)
      let factory = await T.EventStoreFactoryContract.deployed()
      let accountAddresses = await TransmuteFramework.getAccounts()
      let account = accountAddresses[0]
      let state = await T.Factory.getFactoryReadModel(factory, account)
      console.log(state)
    })

    // Believed to be failing due to jest env differences/
    // it.only('should support firestore web sdk', async () => {
    //   jest.setTimeout(30 * 1000)

    //   const firebase = require('firebase')
    //   // Required for side-effects
    //   require('firebase/firestore')

    //   firebase.initializeApp({
    //     apiKey: 'AIzaSyAz5HkV4suTR49_1Cj40bQYd9Jgiv634qQ',
    //     authDomain: 'transmute-framework.firebaseapp.com',
    //     databaseURL: 'https://transmute-framework.firebaseio.com',
    //     projectId: 'transmute-framework',
    //     storageBucket: 'transmute-framework.appspot.com',
    //     messagingSenderId: '191884578641',
    //   })

    //   // Initialize Cloud Firestore through Firebase
    //   const db = firebase.firestore()

    //   let T = TransmuteFramework.init({
    //     providerUrl: 'http://localhost:8545',
    //     aca: accessControlArtifacts,
    //     esa: eventStoreArtifacts,
    //     esfa: eventStoreFactoryArtifacts,
    //     db,
    //   })

    //   // console.log(TransmuteFramework.config.firebaseConfig)
    //   let factory = await T.EventStoreFactoryContract.deployed()
    //   let accountAddresses = await TransmuteFramework.getAccounts()
    //   let account = accountAddresses[0]
    //   let state = await T.Factory.getFactoryReadModel(factory, account)
    //   console.log(state)
    // })
  })
})
