const ipfsAPI = require('ipfs-api')

var ipld = require('ipld')
var jiff = require('jiff')

import * as _ from 'lodash'

// IPFS Gateway
// https://ipfs.infura.io 
// IPFS RPC
// https://ipfs.infura.io:5001 

export interface IIpfsConfig {
    host: string
    port: string
    options: {
        protocol: any
    }
}

export interface ITransmuteIpfs {
    ipfs: any
    isObjectStore: boolean;
    config: IIpfsConfig
    init: (config: IIpfsConfig) => ITransmuteIpfs
    addFromFs: (path: string) => Promise<any>
    addFromURL: (url: string) => Promise<any>
    writeObject: (obj: any) => Promise<string>
    readObject: (hash: string) => Promise<any>
}

export class TransmuteIpfsSingleton implements ITransmuteIpfs {
    ipfs: any
    isObjectStore: boolean = true //used to tell if objects are stored on ipfs or in ethereum... pretty hacky...
    config: IIpfsConfig
    init(config = {
        host: 'localhost',
        port: '5001',
        options: {
            protocol: 'http'
        }
    }) {
        this.config = config
        this.ipfs = ipfsAPI(this.config.host, this.config.port, this.config.options)
        return this
    }

    addFromFs(folderPath, options = {
        recursive: true,
        ignore: ['node_modules/**']
    }) {
        return new Promise((resolve, reject) => {
            this.ipfs.util.addFromFs(folderPath, options, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }

    addFromURL(url) {
        return new Promise((resolve, reject) => {
            this.ipfs.util.addFromURL(url, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }

    writeBuffer(buffer) {
        return new Promise((resolve, reject) => {
            this.ipfs.add(buffer, (err, res) => {
                if (err || !res) {
                    reject(err)
                }
                resolve(res[0].path)
            })
        })
    }

    writeObject(obj) {
        let buffer = new Buffer(JSON.stringify(obj))
        return this.writeBuffer(buffer)
    }

    readBuffer(hash) {
        return new Promise((resolve, reject) => {
            this.ipfs.cat(hash, (err, stream) => {
                if (err) {
                    reject(err)
                }
                let data = new Buffer('')
                stream.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                })
                stream.on('end', () => {
                    resolve(data)
                })
            })
        })
    }

    readObject(path) {
        if (path.indexOf('ipfs/') !== -1) {
            path = path.split('ipfs/')[1]
        }
        return this.readBuffer(path)
            .then((data: any) => {
                return JSON.parse(data.toString())
            })

    }

    // See https://github.com/cujojs/jiff
    statesToPatches(states) {
        return new Promise((resolve, reject) => {
            let patches = []
            for (var i = 0; i <= states.length - 2; i++) {
                patches.push(jiff.diff(states[i], states[i + 1]))
            }
            resolve(patches)
        })
    }

    patchesToHashes(patches) {
        return new Promise((resolve, reject) => {
            let marshalledPatches = patches.map((patch) => {
                return ipld.marshal(patch)
            })
            let promises = marshalledPatches.map((mp) => {
                return this.writeBuffer(mp)
            })
            resolve(Promise.all(promises))
        })
    }

    hashesToPatches = async (hashes) => {
        let marshalledPatches = await Promise.all(hashes.map((hash) => {
            return this.readBuffer(hash)
        }))
        return marshalledPatches.map((marshalled: string) => {
            return ipld.unmarshal(new Buffer(marshalled))
        })
    }

    applyPatches = (obj, patches) => {
        let patched = _.clone(obj)
        patches.forEach((patch) => {
            patched = jiff.patchInPlace(patch, patched)
        })
        return patched
    }

    applyIPLDHashes = async (obj, hashes) => {
        let patches = await this.hashesToPatches(hashes)
        return this.applyPatches(obj, patches)
    }
}

export var TransmuteIpfs = new TransmuteIpfsSingleton()




