

import Web3 from 'web3'

import { without } from 'lodash'

export const envs = ['testrpc', 'parity', 'infura', 'metamask']

let currentEnv = 'testrpc'

let _web3, _provider
switch (currentEnv) {
  case 'testrpc': _provider = 'http://localhost:8545'; break
  case 'parity': _provider = 'http://localhost:8545'; break
  case 'infura': _provider = 'https://ropsten.infura.io'; break
}

switch (currentEnv) {
  case 'testrpc': _web3 = new Web3(new Web3.providers.HttpProvider(_provider)); break
  case 'parity': _web3 = new Web3(new Web3.providers.HttpProvider(_provider)); break
  case 'metamask': _web3 = window.web3; break
}

export const getRandomAddress = (addresses, exclude = []) => {
  let possible = without(addresses, exclude)
  let addr = possible[Math.floor(Math.random() * possible.length)]
  return addr
}

export const web3 = _web3
