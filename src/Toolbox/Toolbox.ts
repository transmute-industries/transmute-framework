
import { ITransmuteFramework } from '../TransmuteFramework';

import * as util from 'ethereumjs-util';

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');

export class Toolbox {

  constructor(
    public framework: ITransmuteFramework,
  ) {

  }

  public sign = (address, message) => {
    return new Promise((resolve, reject) => {
        // console.log(message.length)
        // THIS IS LAME... testrpc... I hate you....
        this.framework.web3.eth.sign(address, message, (err, signature) => {
            if (err) {
                this.framework.web3.eth.sign(address, this.framework.web3.sha3(message), (err, signature) => {
                    if (err) {
                        throw err;
                    }
                    resolve(signature)
                })
            } else {
                resolve(signature)
            }
        })
    })
}

public recover = (address, message, signature) => {
    return new Promise((resolve, reject) => {
        let r = util.toBuffer(signature.slice(0, 66))
        let s = util.toBuffer('0x' + signature.slice(66, 130))
        let v = parseInt(signature.slice(130, 132), 16)
        if ([0, 1].indexOf(v) !== -1) {
            v += 27
        }
        let m = util.toBuffer(this.framework.web3.sha3(message));
        let pub = util.ecrecover(m, v, r, s)
        let recovered_address = '0x' + util.pubToAddress(pub).toString('hex')
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






