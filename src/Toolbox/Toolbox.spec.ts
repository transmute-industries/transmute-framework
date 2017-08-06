'use strict'

import TransmuteFramework from '../TransmuteFramework'

const { web3, Toolbox, } = TransmuteFramework.init()

import { expect, assert } from 'chai'

import * as _ from 'lodash'

const accessControlArtifacts = require('../../build/contracts/RBAC')
const eventStoreArtifacts = require('../../build/contracts/RBACEventStore')
const eventStoreFactoryArtifacts = require('../../build/contracts/RBACEventStoreFactory')

describe('Toolbox', () => {

    let account_addresses, account;
    let default_mnemonic = 'shoulder biology glory jacket pony circle nuclear wood arrow erupt stomach sing';

    before(async () => {
        account_addresses = await TransmuteFramework.getAccounts();
        account = account_addresses[0];
    })

    describe('.sign', () => {
        it('returns a signature', async () => {
            let { web3 } = TransmuteFramework;
            let signature = await Toolbox.sign(account, 'hello');
        })
    })

    describe('.recover', () => {
        it('returns the address used for a hashed_message + signature', async () => {
            let { web3 } = TransmuteFramework;
            let signature = await Toolbox.sign(account, 'hello');
            let addr = await Toolbox.recover(account, 'hello', signature);
            assert(addr === account)
        })
    })

    describe('.generateMnemonic', () => {
        it('returns bip39 mnemonic', async () => {
            let mnemonic = Toolbox.generateMnemonic()
            console.log(mnemonic)
        })
    })

    describe('.getWalletFromMnemonic', () => {
        it('returns a wallet for bip39 mnemonic', async () => {
            let mnemonic = Toolbox.generateMnemonic();
            let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
        })
    })

    describe('.getDefaultAddressFromWallet', () => {
        it('returns a wallet for bip39 mnemonic', async () => {
            let mnemonic = Toolbox.generateMnemonic();
            let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
            let addr = Toolbox.getDefaultAddressFromWallet(wallet);
        })
    })

    describe('supports light wallet sign/recover', () => {

        it('when initialized with wallet', async () => {
            var mnemonic = "couch solve unique spirit wine fine occur rhythm foot feature glory away";
            let wallet = Toolbox.getWalletFromMnemonic(default_mnemonic);
            TransmuteFramework.init({
                env: 'infura',
                wallet: wallet,
                aca: accessControlArtifacts,
                esa: eventStoreArtifacts,
                esfa: eventStoreFactoryArtifacts
            })
            let addr = Toolbox.getDefaultAddressFromWallet(wallet);
            let signature = await Toolbox.sign(addr, 'hello');
            let recoverd_addr = await Toolbox.recover(addr, 'hello', signature);
            assert(recoverd_addr === addr)
        })

        it('when wallet added later...', async () => {
            var mnemonic = Toolbox.generateMnemonic();
            let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
            TransmuteFramework.init()
            let confg = TransmuteFramework.config;
            confg.wallet = wallet
            TransmuteFramework.init(confg)
            let addr = TransmuteFramework.Toolbox.getDefaultAddressFromWallet(wallet);
            let signature = await TransmuteFramework.Toolbox.sign(addr, 'hello');
            let recoverd_addr = await TransmuteFramework.Toolbox.recover(addr, 'hello', signature);
            assert(recoverd_addr === addr)
        })
    })
})
