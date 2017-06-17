
import { expect, assert, should } from 'chai'

import { TransmuteIpfs } from './TransmuteIpfs'

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
            return TransmuteIpfs.addFromFs('./src/TransmuteIpfs/mock')
                .then((res) => {
                    assert.equal(res[0].path, 'mock/config.json')
                    assert.equal(res[1].path, 'mock')
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
})