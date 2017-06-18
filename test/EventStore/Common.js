const toAscii = (value) => {
    return web3.toAscii(value).replace(/\u0000/g, '')
}

const isVmException = (e) => {
    return e.toString().indexOf('VM Exception while') !== -1
}

const isTypeError = (e) => {
    return e.toString().indexOf('TypeError') !== -1
}

module.exports = {
    toAscii,
    isVmException,
    isTypeError
}
