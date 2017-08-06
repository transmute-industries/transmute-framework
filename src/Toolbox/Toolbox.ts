
import { ITransmuteFramework } from '../TransmuteFramework';

import * as util from 'ethereumjs-util';

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');

export class Toolbox {

  constructor(
    public framework: ITransmuteFramework,
  ) {

  }

  public sign = (address: string, message_hash: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.framework.web3.eth.sign(address, message_hash, (err, signature) => {
        if (err) {
          throw err;
        }
        resolve(signature)
      })
    })
  }

  public recover = (address: string, message_hash: string, signature: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      var r = util.toBuffer(signature.slice(0, 66))
      var s = util.toBuffer('0x' + signature.slice(66, 130))
      var v = parseInt(signature.slice(130, 132), 16) + 27
      // console.log(v)
      var m = util.toBuffer(message_hash)
      var pub = util.ecrecover(m, v, r, s)
      var recovered_address = '0x' + util.pubToAddress(pub).toString('hex')
      // console.log(address, recovered_address)
      resolve(recovered_address)
    })
  }

  public generateMnemonic = () => {
    return bip39.generateMnemonic()
  }

  public getWalletFromMnemonic = (mnemonic: string) => {
    var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    // Get the first account using the standard hd path.
    var wallet_hdpath = "m/44'/60'/0'/0/";
    var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
    return wallet;
  }

  public getDefaultAddressFromWallet = (wallet: any) => {
    return "0x" + wallet.getAddress().toString("hex");
  }

  public getDefaultAddressFromMnemonic = (mnemonic: string) => {
    return this.getDefaultAddressFromWallet(this.getWalletFromMnemonic(mnemonic))
  }


}






