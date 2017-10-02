import * as util from "ethereumjs-util";
import * as _ from "lodash";
export const getAddress = (web3: any) => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err: any, addresses: string[]) => {
      if (err) {
        reject(err);
      }
      resolve(addresses[0]);
    });
  });
};

export const signMessage = (
  web3: any,
  address: string,
  msgHex: string
): Promise<any> => {
  let sigPromise = new Promise((resolve, reject) => {
    web3.eth.sign(address, msgHex, (err: any, signature: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(signature);
      }
    });
  });
  return sigPromise
    .then(signature => {
      return signature;
    })
    .catch(() => {
      return null;
    });
};

export const testRecover = (address: string, data: string, sig: string) => {
  const { v, r, s } = util.fromRpcSig(sig);
  const pubKey = util.ecrecover(data, v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const addr = util.bufferToHex(addrBuf);
  // console.log(address, addr);
  return address === addr;
};

export const prepareStringForSigning = (value: string) => {
  const msg = new Buffer(value);
  const msgHex = "0x" + msg.toString("hex");
  return {
    msg,
    msgHex
  };
};

export const getSha3BufferOfPrefixedMessage = (msg: Buffer) => {
  const prefix = new Buffer("\x19Ethereum Signed Message:\n");
  const prefixedMsgBuffer = util.sha3(
    Buffer.concat([prefix, new Buffer(String(msg.length)), new Buffer(msg)])
  );
  return prefixedMsgBuffer;
};

export const getSha3BufferOfMessage = (msg: Buffer) => {
  return util.toBuffer(util.sha3(msg));
};

export const getMessageSignatureWithMeta = async (
  web3: string,
  address: string,
  message: string
) => {
  const msgObj = prepareStringForSigning(message);

  const sig = await signMessage(web3, address, msgObj.msgHex);

  if (sig === null) {
    throw new Error(
      "Cannot sign message with address. Consider if this address is a node or wallet address, and how web3 provider engine has been initialized."
    );
  }

  const prefixedMessageBuffer = getSha3BufferOfPrefixedMessage(msgObj.msg);
  const messageBuffer = getSha3BufferOfMessage(msgObj.msg);

  let isPrefixed;

  if (testRecover(address, prefixedMessageBuffer, sig)) {
    isPrefixed = true;
  }

  if (testRecover(address, messageBuffer, sig)) {
    isPrefixed = false;
  }

  return {
    messageBuffer: isPrefixed ? prefixedMessageBuffer : messageBuffer,
    messageHex: msgObj.msgHex,
    signature: sig,
    address,
    isPrefixed
  };
};
