'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { Toolbox } = TransmuteFramework.init()

import { expect, assert } from 'chai'

import * as _ from 'lodash'

describe.only('Toolbox', () => {

    describe('.sign', () => {
        it('returns a signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await Toolbox.sign(web3.eth.accounts[0], message_hash);
            // console.log(signature);
        })
    })

    describe('.recover', () => {
        it('returns the address used for a hashed_message + signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await Toolbox.sign(web3.eth.accounts[0], message_hash);
            let addr = await Toolbox.recover(web3.eth.accounts[0], message_hash, signature);
            // console.log(addr);
            assert(addr === web3.eth.accounts[0])
        })
    })

})
