
var fs = require('fs')
var rimraf = require('rimraf')

let sourceDirectory = '../node_modules/transmute-framework/build/contracts/TransmuteFramework/'
let destinationDirectory = '../contracts/TransmuteFramework/'

// For Testing
// let sourceDirectory = '../node_modules/@digix/'
// let destinationDirectory = '../contracts/@digix/'

var ncp = require('ncp').ncp
ncp.limit = 16

const addTransmuteContracts = (_callback) =>{
    ncp(sourceDirectory, destinationDirectory, _callback)
}

const removeTransmuteContracts = (_callback) =>{
  rimraf(destinationDirectory,  _callback)
}

module.exports = {
    addTransmuteContracts,
    removeTransmuteContracts
}