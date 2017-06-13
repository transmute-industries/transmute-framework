
var fs = require('fs')
var rimraf = require('rimraf')
var path = require('path')

let sourceDirectory = path.resolve(__dirname,  '../../test/')
let destinationDirectory = path.resolve(__dirname,  '../../../../../test/TransmuteFramework/')

var ncp = require('ncp').ncp
ncp.limit = 16

const addTransmuteTests = (_callback) =>{
    ncp(sourceDirectory + '/', destinationDirectory + '/', _callback)
}

const removeTransmuteTests = (_callback) =>{
  rimraf(destinationDirectory,  _callback)
}

module.exports = {
    addTransmuteTests,
    removeTransmuteTests
}
