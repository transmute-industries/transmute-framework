const Web3 = require("web3");
const util = require("ethereumjs-util");
const ProviderEngine = require("web3-provider-engine");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet.js");
const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");
const FetchSubprovider = require("web3-provider-engine/subproviders/fetch.js");
const Transaction = require("ethereumjs-tx");
const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");

const generateMnemonic = () => {
  return bip39.generateMnemonic();
};

const getWalletFromMnemonic = (mnemonic: string) => {
  const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
  // Get the first account using the standard hd path.
  const walletHDPath = "m/44'/60'/0'/0/";
  const wallet = hdwallet.derivePath(walletHDPath + "0").getWallet();
  return wallet;
};

const getDefaultAddressFromWallet = (wallet: any) => {
  return "0x" + wallet.getAddress().toString("hex");
};

const getAddress = (web3: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err: any, addresses: string[]) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(addresses[0].toLowerCase());
    });
  });
};

const sign = (web3: any, address: string, message: string): Promise<string> => {
  const msg = new Buffer(message);
  const msgHex = "0x" + msg.toString("hex");
  return new Promise(async (resolve, reject) => {
    web3.eth.sign(address, msgHex, (err: any, signature: string) => {
      if (err) {
        console.log(err.message);
        reject(err);
      }
      resolve(signature);
    });
  });
};

const recover = (web3: any, message: string, messageSignature: string) => {
  const msg = new Buffer(message);
  const msgHex = "0x" + msg.toString("hex");
  return new Promise(async (resolve, reject) => {
    const res = util.fromRpcSig(messageSignature);
    const prefix = new Buffer("\x19Ethereum Signed Message:\n");
    const prefixedMsg = util.sha3(
      Buffer.concat([prefix, new Buffer(String(msg.length)), msg])
    );
    const pubKey = util.ecrecover(prefixedMsg, res.v, res.r, res.s);
    const addrBuf = util.pubToAddress(pubKey);
    const addr = util.bufferToHex(addrBuf);
    resolve(addr);
  });
};

const sign2 = (
  web3: any,
  address: string,
  message: string
): Promise<string> => {
  const msg = web3.sha3(message);
  return new Promise(async (resolve, reject) => {
    web3.eth.sign(address, msg, (err: any, signature: string) => {
      if (err) {
        console.log(err.message);
        reject(err);
      }
      resolve(signature);
    });
  });
};

const recover2 = (web3: any, message: string, messageSignature: string) => {
  const msg = web3.sha3(message);
  return new Promise(async (resolve, reject) => {
    const { v, r, s } = util.fromRpcSig(messageSignature);
    const pubKey = util.ecrecover(util.toBuffer(msg), v, r, s);
    const addrBuf = util.pubToAddress(pubKey);
    const addr = util.bufferToHex(addrBuf);
    resolve(addr);
  });
};

describe.only("ecreover", () => {
  const testSignatureRecover = async (
    web3: any,
    address: string,
    message: string
  ) => {
    const signature = await sign(web3, address, message);
    const recoveredAddress = await recover(web3, message, signature);
    expect(recoveredAddress).toBe(address);
  };

  const testSignatureRecover2 = async (
    web3: any,
    address: string,
    message: string
  ) => {
    const signature = await sign2(web3, address, message);
    const recoveredAddress = await recover2(web3, message, signature);
    expect(recoveredAddress).toBe(address);
  };

  it("it works with provider engine", async () => {
    const engine = new ProviderEngine();
    engine.addProvider(
      new Web3Subprovider(
        new Web3.providers.HttpProvider("http://localhost:8545")
      )
    );
    engine.start();
    const web3 = new Web3(engine);
    const address = await getAddress(web3);
    await testSignatureRecover(web3, address, "hello!");
  });

  it("it works without provider engine", async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
    const address = await getAddress(web3);
    await testSignatureRecover(web3, address, "hello!");
  });

  it("it works with a WalletSubprovider", async () => {
    const engine = new ProviderEngine();
    const mnemonic =
      "chunk advance repeat surprise medal oil anger laundry describe cricket liar force";
    const wallet = getWalletFromMnemonic(mnemonic);
    const address = getDefaultAddressFromWallet(wallet);
    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(
      new FetchSubprovider({
        // rpcUrl: "http://localhost:8545"
        rpcUrl: "https://ropsten.infura.io/"
        // rpcUrl: "http://testrpc.azurewebsites.net"
      })
    );
    engine.start();
    const web3 = new Web3(engine);
    await testSignatureRecover(web3, address, "hello!");
  });
});
