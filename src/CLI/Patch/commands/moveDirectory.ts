
var fs = require('fs')
var rimraf = require('rimraf')
var path = require('path')
var ncp = require('ncp').ncp
ncp.limit = 16

export const add = (src, dst, _callback) => {
    ncp(src + '/', dst + '/', _callback)
}

export const remove = (dst, _callback) => {
    rimraf(dst, _callback)
}

