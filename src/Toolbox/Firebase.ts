import { ITransmuteFramework } from '../transmute-framework'

import * as QueryString from 'querystring'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const getChallenge = async (address, sigObj) => {
  let url =
    'http://localhost:3001/token?' +
    QueryString.stringify({
      method: 'challenge',
      address: address,
      message_raw: sigObj.messageBufferHex,
      message_hex: sigObj.messageHex,
      message_signature: sigObj.signature,
    })
  return await fetch(url).then(async response => {
    if (response.status >= 400) {
      throw new Error('Bad response from server')
    }
    return await response.json()
  })
}

const getToken = async (address, signedChallange) => {
  let url =
    'http://localhost:3001/token?' +
    QueryString.stringify({
      method: 'verify',
      address: address,
      message_raw: signedChallange.messageBufferHex,
      message_hex: signedChallange.messageHex,
      message_signature: signedChallange.signature,
    })
  return await fetch(url).then(async response => {
    if (response.status >= 400) {
      throw new Error('Bad response from server')
    }
    return await response.json()
  })
}

export default class Firebase {
  constructor(public framework: ITransmuteFramework) {}

  async login() {
    // console.log('login..', .getAccounts())
    const T = this.framework as any
    const accounts = await T.getAccounts()
    const address = accounts[0]
    // console.log('🔏  Logging into Firebase with transmute-framework...')
    const sigObj = await T.Toolbox.sign(address, 'transmute.framework.login')
    // console.log(sigObj)
    const challengeResponse = await getChallenge(address, sigObj)
    if (challengeResponse.status !== 200) {
      throw Error(challengeResponse)
    }
    if (!challengeResponse.body.conditions.didClientAddressSignMessageRaw) {
      throw Error('Server does not trust signature. didClientAddressSignMessageRaw: false')
    }
    // console.log(challengeResponse)
    const signedChallengeMessageRaw = challengeResponse.body.challenge
    const signedChallange = await T.Toolbox.sign(address, signedChallengeMessageRaw)
    const tokenResponse = await getToken(address, signedChallange)

    return await this.framework.firebaseApp
      .auth()
      .signInWithCustomToken(tokenResponse.body.token)
      .then(data => {
        if (data.uid === address) {
          console.log('🏡  Logged in as:', address)
        }
      })
      .catch(error => {
        throw error
      })
  }
  logout() {
    console.log('logout..')
  }
}
