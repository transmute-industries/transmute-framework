var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const firebaseConfig = {
  apiKey: 'AIzaSyBev_5tS4kmdcgi6LcUhGP3HBP1s5Rl0H8',
  authDomain: 'eth-faucet.firebaseapp.com',
  databaseURL: 'https://eth-faucet.firebaseio.com',
  projectId: 'eth-faucet',
  storageBucket: 'eth-faucet.appspot.com',
  messagingSenderId: '686546727130'
}

module.exports = {
  web3,
  firebaseConfig
}