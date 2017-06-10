const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const through = require('through2')
const concat = require('concat-stream')
const EventStoreFactory = artifacts.require('./TransmuteFramework/EventStoreFactory.sol')
const EventStore = artifacts.require('./TransmuteFramework/EventStore.sol')

let factory, eventStore

function toAscii(value) {
    return web3.toAscii(value).replace(/\u0000/g, '')
}

var ipfsAPI = require('ipfs-api')
// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

const readFilesFromHashAsync = (hash) => {
    return ipfs.files.get(hash).then((stream) => {
        let files = []
        return new Promise((resolve, reject) => {
            stream.pipe(through.obj((file, enc, next) => {
                file.content.pipe(concat((content) => {
                    files.push({
                        path: file.path,
                        content: content.toString()
                    })
                    next()
                }))
            }, () => {
                resolve(files)
            }))
        })
    })
}

const writeFilesAsync = (files) => {
    return ipfs.files.add(files)
}


describe('IPFS Tests', () => {

    describe('IPFS Middleware', () => {
        it('Can read a json object from IPFS', async () => {
            const hash = 'QmUSP6XraEyCHSDhehrFsHK1MvwthbZccwnh9fBmNj3jQr'
            let files = await readFilesFromHashAsync(hash)
            // console.log('files: ', files)
            assert(files[0].path == hash)
        })

        it('Can write a json object from IPFS', async () => {
            const tfpath = path.join(__dirname, '/edit.json')
            const rs = fs.createReadStream(tfpath)
            const inputFile = {
                path: 'edit.json',
                content: rs
            }
            const expectedMultihash = 'QmUSP6XraEyCHSDhehrFsHK1MvwthbZccwnh9fBmNj3jQr'
            const files = [inputFile]
            let res = await writeFilesAsync(files)
            const fileFromResponse = res[0]
            // console.log('file.hash: ', file.hash)
            assert(fileFromResponse.hash === expectedMultihash)
            assert(fileFromResponse.path === inputFile.path)
        })
    })

    contract('IPFS EventStore', (accounts) => {
        beforeEach(async () => {
            factory = await EventStoreFactory.deployed()
            let tx = await factory.createEventStore({
                from: accounts[0],
                gas: 2000000
            })
            let eventStoreAddress = tx.logs[0].args.AddressValue
            eventStore = await EventStore.at(eventStoreAddress)
            // console.log(eventStore)
        })

        // Bytes32 is not long enough to store IPFS hashes, need StringValue Type
        // it('An IPFS events is a Bytes32Value event', async () => {
        //     const multihashStr = 'QmUSP6XraEyCHSDhehrFsHK1MvwthbZccwnh9fBmNj3jQr'
        //     let tx = await eventStore.writeEvent(
        //         'IPFS:RECORD:CREATED',
        //         'v0',
        //         'Bytes32',
        //         0,
        //         0,
        //         multihashStr,
        //         0
        //     )
        //     let eventBytes32 = tx.logs[0].args.Bytes32Value
        //     console.log(toAscii(eventBytes32))
        //     // assert( === multihashStr)
        // })
    })
})
