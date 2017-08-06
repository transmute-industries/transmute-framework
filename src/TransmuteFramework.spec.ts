'use strict'

const contract = require('truffle-contract')

import * as _ from 'lodash'
import { expect, assert, should } from 'chai'

import TransmuteFramework from './TransmuteFramework'

const accessControlArtifacts = require('../build/contracts/RBAC')
const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');


describe('TransmuteFramework', () => {

    before(async () => {

    })

    describe('.init', () => {
        it('should use testrpc as default web3 provider', async () => {
            TransmuteFramework.init()
            // TODO: add tests here...
        })
        it('should support infura ropsten', async () => {

            TransmuteFramework.init({
                env: 'infura',
                aca: accessControlArtifacts,
                esa: eventStoreArtifacts,
                esfa: eventStoreFactoryArtifacts
            })
            // TODO: add tests here...
        })

        it('should support HD Lightwallets', async () => {

            var mnemonic = "couch solve unique spirit wine fine occur rhythm foot feature glory away";
            var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

            // Get the first account using the standard hd path.
            var wallet_hdpath = "m/44'/60'/0'/0/";
            var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();

            TransmuteFramework.init({
                env: 'infura',
                wallet: wallet,
                aca: accessControlArtifacts,
                esa: eventStoreArtifacts,
                esfa: eventStoreFactoryArtifacts
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
    })

})
