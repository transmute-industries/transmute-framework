
var fs = require('fs')
var rimraf = require('rimraf')
var path = require('path')

let sourceDirectory = path.resolve(__dirname,  '../../contracts/TransmuteFramework/') 
let destinationDirectory = path.resolve(__dirname,  '../../../../../contracts/TransmuteFramework/')  

var ncp = require('ncp').ncp
ncp.limit = 16

const addTransmuteContracts = (_callback) =>{
    ncp(sourceDirectory + '/', destinationDirectory + '/', _callback)
}

const removeTransmuteContracts = (_callback) =>{
  rimraf(destinationDirectory,  _callback)
}

module.exports = {
    addTransmuteContracts,
    removeTransmuteContracts
}