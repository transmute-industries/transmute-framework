'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { web3, Toolbox, } = TransmuteFramework.init()

import { expect, assert } from 'chai'

import * as _ from 'lodash'

describe('Toolbox', () => {

    let account_addresses, account;

    before(async () => {
        account_addresses = await TransmuteFramework.getAccounts();
        account = account_addresses[0];
    })

    describe('.sign', () => {
        it('returns a signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await Toolbox.sign(account, message_hash);
            // console.log(signature);
        })
    })

    describe('.recover', () => {
        it('returns the address used for a hashed_message + signature', async () => {
            let { web3 } = TransmuteFramework;
            let message_hash = web3.sha3('hello');
            let signature = await Toolbox.sign(account, message_hash);
            let addr = await Toolbox.recover(account, message_hash, signature);
            // console.log(addr);
            assert(addr === account)
        })
    })

    describe('.generateMnemonic', () => {
        it('returns bip39 mnemonic', async () => {
            // console.log(Toolbox.generateMnemonic())
        })
    })

})
