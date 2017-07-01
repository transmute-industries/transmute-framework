const bs58 = require('bs58');
const util = require('ethereumjs-util');

const toAscii = (value) => {
    return web3.toAscii(value).replace(/\u0000/g, '')
}

const isVmException = (e) => {
    return e.toString().indexOf('VM Exception while') !== -1
}

const isTypeError = (e) => {
    return e.toString().indexOf('TypeError') !== -1
}

// https://blog.stakeventures.com/articles/smart-contract-terms
const hex2ipfshash = (hash) => {
 return bs58.encode(new Buffer("1220" + hash.slice(2), 'hex'))
}

const ipfs2hex = (ipfshash) => {
 return "0x" + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex');
}

const marshalEvent = (_meta, _type, _data) => {
    // 'I' Encodes that this is IPLD, so we know to remove Qm (and add it back)
    if (_type === 'I'){
        _data = ipfs2hex(_data)
    }
    // Left padd ints and addresses for bytes32 equivalence of Solidity casting
    if (_type === 'U' || _type === 'A'){
        _data = util.bufferToHex(util.setLengthLeft(_data, 32)) 
    }
    return {
        meta: _meta,
        type: _type,
        data: _data
    }
}

const unMarshalEvent = (_meta, _type, _data) => {
    _meta = toAscii(_meta)
    _type = toAscii(_type)
    switch(_type){
        case 'A': _data = '0x' + _data.split('0x000000000000000000000000')[1]; break
        case 'U': _data =  web3.toBigNumber(_data).toNumber(); break
        case 'B': _data = _data; break
        case 'I': _data = hex2ipfshash(_data); break
    }
    return {
        meta: _meta,
        type: _type,
        data: _data
    }
}

module.exports = {
    toAscii,
    marshalEvent,
    unMarshalEvent,
    isVmException,
    isTypeError
}
