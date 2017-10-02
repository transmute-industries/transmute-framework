import { ITransmuteFramework } from "../transmute-framework";

import * as util from "ethereumjs-util";

const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");

export class Toolbox {
  constructor(public framework: ITransmuteFramework) {}

  public sign = (address: string, message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // console.log(message.length)
      // THIS IS LAME... testrpc... I hate you....
      this.framework.web3.eth.sign(
        address,
        this.framework.web3.sha3(this.framework.web3.sha3(message)),
        (err: any, signature: string) => {
          if (err) {
            throw err;
          }
          resolve(signature);
        }
      );
    });
  };

  public recover = (address: string, message: string, signature: string) => {
    return new Promise((resolve, reject) => {
      let r = util.toBuffer(signature.slice(0, 66));
      let s = util.toBuffer("0x" + signature.slice(66, 130));
      let v = parseInt(signature.slice(130, 132), 16);
      if ([0, 1].indexOf(v) !== -1) {
        v += 27;
      }
      let m = util.toBuffer(this.framework.web3.sha3(message));
      let pub = util.ecrecover(m, v, r, s);
      let recoveredAddress = "0x" + util.pubToAddress(pub).toString("hex");
      resolve(recoveredAddress);
    });
  };

  public generateMnemonic = () => {
    return bip39.generateMnemonic();
  };

  public getWalletFromMnemonic = (mnemonic: string) => {
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    // Get the first account using the standard hd path.
    const walletHDPath = "m/44'/60'/0'/0/";
    const wallet = hdwallet.derivePath(walletHDPath + "0").getWallet();
    return wallet;
  };

  public getDefaultAddressFromWallet = (wallet: any) => {
    return "0x" + wallet.getAddress().toString("hex");
  };

  public getDefaultAddressFromMnemonic = (mnemonic: string) => {
    return this.getDefaultAddressFromWallet(
      this.getWalletFromMnemonic(mnemonic)
    );
  };
}
