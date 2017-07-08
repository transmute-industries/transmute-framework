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
            const eventStoreArtifacts = require('../build/contracts/RBACEventStore')
            const eventStoreFactoryArtifacts = require('../build/contracts/RBACEventStoreFactory')
            TransmuteFramework.init({
                env: 'infura',
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

})
