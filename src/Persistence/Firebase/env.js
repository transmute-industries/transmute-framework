var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const firebaseConfig = {
  apiKey: 'AIzaSyAz5HkV4suTR49_1Cj40bQYd9Jgiv634qQ',
  authDomain: 'transmute-framework.firebaseapp.com',
  databaseURL: 'https://transmute-framework.firebaseio.com',
  projectId: 'transmute-framework',
  storageBucket: 'transmute-framework.appspot.com',
  messagingSenderId: '191884578641'
}

module.exports = {
  web3,
  firebaseConfig
}