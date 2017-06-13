var path = require('path')

var TransmuteFramework = require('../../build/TransmuteFramework').default

let { web3, EventStoreContract, EventStoreFactoryContract } = TransmuteFramework.init()
let { getCachedReadModel } = TransmuteFramework.EventStore.ReadModel

var _ = require('lodash')

// transmute ipfs deploy --target dist
// - deploy the target folder to ipfs and return the response
const transmuteIpfsDeploy = async (bindingModel) => {
    let ti
    if (bindingModel.env === 'infura') {
        ti = TransmuteFramework.TransmuteIpfs.init()
    }
    if (bindingModel.env === 'local') {
        ti = TransmuteFramework.TransmuteIpfs.init({
            host: 'localhost',
            port: '5001',
            options: {
                protocol: 'http'
            }
        })
    }
    if (!ti) {
        throw Error('transmuteIpfsDeploy requires env: "local"|"infura"')
    }
    return await ti.addFromFs(bindingModel.directory)
}

module.exports = {
    transmuteIpfsDeploy
}

