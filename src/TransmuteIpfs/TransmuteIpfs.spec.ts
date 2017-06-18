const ipfsAPI = require('ipfs-api')
const ipld = require('ipld')
const jiff = require('jiff')

import { expect, assert, should } from 'chai'

import { TransmuteIpfs } from './TransmuteIpfs'

import * as _ from 'lodash'

let e0 = require('./mock/events/0.json')
let e1 = require('./mock/events/1.json')
let e2 = require('./mock/events/2.json')

describe('TransmuteIpfs', () => {
    describe('init()', () => {
        it('should use local ipfs by default', () => {
            TransmuteIpfs.init()
            assert.equal(TransmuteIpfs.config.host, 'localhost')
        })
        it('should support infura via config', () => {
            TransmuteIpfs.init({
                host: 'ipfs.infura.io',
                port: '5001',
                options: {
                    protocol: 'https'
                }
            })
            assert.equal(TransmuteIpfs.config.host, 'ipfs.infura.io')
        })
    })
    describe('addFromFs(folderPath, options)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should add folder to ipfs and return the result', () => {
            return TransmuteIpfs.addFromFs('./src/TransmuteIpfs/mock/dist')
                .then((res) => {
                    assert.equal(res[0].path, 'dist/config.json')
                    assert.equal(res[1].path, 'dist')
                })
        })
    })
    describe('addFromURL(url)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should add folder to ipfs and return the result', () => {
            return TransmuteIpfs.addFromURL('https://vignette3.wikia.nocookie.net/nyancat/images/7/7c/Nyan_gary.gif')
                .then((res) => {
                    assert.equal(res[0].path, 'QmSAKHa2JdKrhmBKrqWrBAtS7ACwofiRAEWzYNbXdssBEe')
                    assert.equal(res[0].hash, 'QmSAKHa2JdKrhmBKrqWrBAtS7ACwofiRAEWzYNbXdssBEe')
                })
        })
    })
    describe('writeObject(obj)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should add json object to ipfs and return the path', () => {
            let obj = { cool: 'story...bro' }
            return TransmuteIpfs.writeObject(obj)
                .then((path) => {
                    assert.equal(path, 'Qmf4GZbciiPLMTZYLpM88GB2CpopCJszdwybUnnwswkpKE')
                })
        })
    })
    describe('readObject(path)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should add json object to ipfs and return the path', () => {
            return TransmuteIpfs.readObject('Qmf4GZbciiPLMTZYLpM88GB2CpopCJszdwybUnnwswkpKE')
                .then((obj: any) => {
                    assert.equal(obj.cool, 'story...bro')
                })
        })
    })


    describe('statesToPatches(states)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should convert an array of states to an array of patches from state 0 to state n', async () => {
            let articleStates = [e0, e1, e2]
            let patches = await TransmuteIpfs.statesToPatches(articleStates)
            // console.log(patches)
            assert.equal(patches[0][0].op, 'add')
        })
    })

    describe('patchesToHashes(patches)', () => {
        before(() => {
            TransmuteIpfs.init()

        })
        it('should save patchObjects as CBOR encoded Buffers on IPFS and return as hashes', async () => {
            let articleStates = [e0, e1, e2]
            let patches = await TransmuteIpfs.statesToPatches(articleStates)
            let hashes = await TransmuteIpfs.patchesToHashes(patches)
            // console.log(hashes)
        })
    })

    describe('hashesToPatches(hashes)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should rehydrate CBOR encoded Buffers from IPFS hashes as patch objects', async () => {
            let articleStates = [e0, e1, e2]
            let patches = await TransmuteIpfs.statesToPatches(articleStates)
            let hashes = await TransmuteIpfs.patchesToHashes(patches)
            let reconstructedPatches = await TransmuteIpfs.hashesToPatches(hashes)
            // console.log(reconstructedPatches)
            assert.equal(reconstructedPatches[0][0].op, 'add')
        })
    })

    describe('applyIPLDHashes(hashes)', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('should rehydrate CBOR encoded Buffers from IPFS hashes as patch objects', async () => {
            let articleStates = [e0, e1, e2]
            let patches = await TransmuteIpfs.statesToPatches(articleStates)
            let hashes = await TransmuteIpfs.patchesToHashes(patches)
            let patched = await TransmuteIpfs.applyIPLDHashes(e0, hashes)
            // console.log(patched)
            assert.equal(patched.blocks[1].text, 'Welcome to IPFS and Ethereum')
        })
    })

    describe('Sanity', () => {
        before(() => {
            TransmuteIpfs.init()
        })
        it('jiff patching works as expected', () => {
            let start = {
                a: [0, 1],
                b: {
                    cool: 'story'
                }
            }
            let end = {
                a: [3],
                b: {
                    dead: 'pool'
                }
            }
            let patch = jiff.diff(start, end)
            let patched = TransmuteIpfs.applyPatches(start, [ patch ])
            // console.log(patched)
            assert(_.isEqual(patched, end))
        })

        it('jiff patching works as expected', (done) => {
            let start = {
                a: [0, 1],
                b: {
                    cool: 'story'
                }
            }
            let end = {
                a: [3],
                b: {
                    dead: 'pool'
                }
            }
            let patch = jiff.diff(start, end)
            let patched = jiff.patch(patch, start)
            assert(_.isEqual(patched, end))
            done()
        })
        it('IPLD + IPFS raw checks', (done) => {
            let rawJsonObject = {
                hello: 'world',
                probablyError: undefined
            }
            let test = async () => {
                let buffer = ipld.marshal(rawJsonObject)
                // console.log(buffer)
                let data = await TransmuteIpfs.ipfs.add(buffer)
                let { hash } = data[0]
                // console.log(hash)
                // var newBuffer = Buffer.concat([buffer1, buffer2]);
                TransmuteIpfs.ipfs.cat(hash, function (err, stream) {
                    var res = new Buffer('')
                    stream.on('data', function (chunk) {
                        res = Buffer.concat([res, chunk]);
                    })
                    stream.on('error', function (err) {
                        // console.error('Oh nooo', err)
                    })
                    stream.on('end', function () {
                        // console.log('Got:', res)
                        let unm = ipld.unmarshal(res)
                        // console.log(unm)
                        assert.equal(unm.probablyError, undefined)
                        done()
                    })
                })
            }
            test()
            // console.log(rawJsonObject)
            // console.log(bufFromIpfs)
        })
    })


})