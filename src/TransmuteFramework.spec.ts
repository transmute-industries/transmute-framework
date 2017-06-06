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
            let { web3 } = TransmuteFramework.init()
            assert (web3._requestManager.provider.host === 'http://localhost:8545')
        })

        it('should support infura ropsten', async () => {
            const eventStoreArtifacts = require('../build/contracts/EventStore')
            const eventStoreFactoryArtifacts = require('../build/contracts/EventStoreFactory')

            let { web3 } = TransmuteFramework.init({
                env: 'infura',
                esa: eventStoreArtifacts,
                esfa: eventStoreFactoryArtifacts
            })
            assert (web3._requestManager.provider.host === 'https://ropsten.infura.io')
        })
    })
})
