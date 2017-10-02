"use strict";

import TransmuteFramework from "../transmute-framework";

const { web3, Toolbox } = TransmuteFramework.init();

import { expect, assert } from "chai";

import * as _ from "lodash";
import * as util from "ethereumjs-util";

const accessControlArtifacts = require("../../build/contracts/RBAC");
const eventStoreArtifacts = require("../../build/contracts/RBACEventStore");
const eventStoreFactoryArtifacts = require("../../build/contracts/RBACEventStoreFactory");

describe("Toolbox", () => {
  let accountAddresses;
  let account: string;
  let defaultMnemonic =
    "shoulder biology glory jacket pony circle nuclear wood arrow erupt stomach sing";

  beforeAll(async () => {
    accountAddresses = await TransmuteFramework.getAccounts();
    account = accountAddresses[0];
  });

  describe.only("sanity", () => {
    it("raw operations succeed", async () => {
      let message = "hello";
      let signature = (await new Promise((resolve, reject) => {
        web3.eth.sign(
          account,
          "0x" + util.sha3(message),
          (err: any, signature: string) => {
            if (err) {
              throw err;
            }
            resolve(signature);
          }
        );
      })) as string;

      let address = (await new Promise((resolve, reject) => {
        let r = util.toBuffer(signature.slice(0, 66));
        let s = util.toBuffer("0x" + signature.slice(66, 130));
        let v = parseInt(signature.slice(130, 132), 16);
        if ([0, 1].indexOf(v) !== -1) {
          v += 27;
        }
        console.log(v);
        let m = util.toBuffer(util.sha3(message));
        let pub = util.ecrecover(m, v, r, s);
        let recoveredAddress = "0x" + util.pubToAddress(pub).toString("hex");
        resolve(recoveredAddress);
      })) as string;

      assert(address === account);
    });
  });

  describe(".sign", () => {
    it("returns a signature", async () => {
      let signature = await Toolbox.sign(account, "hello");
    });
  });

  describe(".recover", () => {
    it("returns the address used for a hashed_message + signature", async () => {
      let signature = await Toolbox.sign(account, "hello");
      let addr = await Toolbox.recover(account, "hello", signature);

      console.log(addr, account);
      assert(addr === account);
    });
  });

  describe(".generateMnemonic", () => {
    it("returns bip39 mnemonic", async () => {
      let mnemonic = Toolbox.generateMnemonic();
    });
  });

  describe(".getWalletFromMnemonic", () => {
    it("returns a wallet for bip39 mnemonic", async () => {
      let mnemonic = Toolbox.generateMnemonic();
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
    });
  });

  describe(".getDefaultAddressFromWallet", () => {
    it("returns a wallet for bip39 mnemonic", async () => {
      let mnemonic = Toolbox.generateMnemonic();
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
      let addr = Toolbox.getDefaultAddressFromWallet(wallet);
    });
  });

  describe("supports light wallet sign/recover", () => {
    it("when initialized with wallet", async () => {
      const mnemonic =
        "couch solve unique spirit wine fine occur rhythm foot feature glory away";
      let wallet = Toolbox.getWalletFromMnemonic(defaultMnemonic);
      TransmuteFramework.init({
        providerUrl: "https://ropsten.infura.io",
        wallet: wallet,
        aca: accessControlArtifacts,
        esa: eventStoreArtifacts,
        esfa: eventStoreFactoryArtifacts
      });
      let addr = Toolbox.getDefaultAddressFromWallet(wallet);
      let signature = await Toolbox.sign(addr, "hello");
      let recoveredAddress = await Toolbox.recover(addr, "hello", signature);
      assert(recoveredAddress === addr);
    });

    it("when wallet added later...", async () => {
      TransmuteFramework.init();

      const mnemonic = Toolbox.generateMnemonic();
      let wallet = Toolbox.getWalletFromMnemonic(mnemonic);
      let config = TransmuteFramework.config;
      config.wallet = wallet;
      TransmuteFramework.init(config);
      let addr = TransmuteFramework.Toolbox.getDefaultAddressFromWallet(wallet);
      let signature = await TransmuteFramework.Toolbox.sign(addr, "hello");
      let recoveredAddress = await TransmuteFramework.Toolbox.recover(
        addr,
        "hello",
        signature
      );
      assert(recoveredAddress === addr);
    });
  });
});
