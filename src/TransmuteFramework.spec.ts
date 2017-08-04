'use strict'

const contract = require('truffle-contract')

import * as _ from 'lodash'
import { expect, assert, should } from 'chai'

import TransmuteFramework from './TransmuteFramework'


describe('TransmuteFramework', () => {

    before(async () => {

    })

    describe('.init', () => {
        it('should use testrpc as default web3 provider', async () => {
            TransmuteFramework.init()
            // console.log(TransmuteFramework.web3)
            assert(TransmuteFramework.web3._requestManager.provider.host === 'http://localhost:8545')
        })
        it('should support infura ropsten', async () => {
            const accessControlArtifacts = require('../build/contracts/RBAC')
            const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
            const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')
            TransmuteFramework.init({
                env: 'infura',
                aca: accessControlArtifacts,
                esa: eventStoreArtifacts,
                esfa: eventStoreFactoryArtifacts
            })
            assert(TransmuteFramework.web3._requestManager.provider.host === 'https://ropsten.infura.io')
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

    describe('.sign', () => {
        before(async () => {
            TransmuteFramework.init();
        })
        it('returns a signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await TransmuteFramework.sign(web3.eth.accounts[0], message_hash);
            // console.log(signature);
        })
    })

    describe('.recover', () => {
        before(async () => {
            TransmuteFramework.init();
        })
        it('returns the address used for a hashed_message + signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await TransmuteFramework.sign(web3.eth.accounts[0], message_hash);
            let addr = await TransmuteFramework.recover(web3.eth.accounts[0], message_hash, signature);
            // console.log(addr);
            assert(addr === web3.eth.accounts[0])
        })
    })

})
