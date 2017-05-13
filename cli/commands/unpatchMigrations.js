var Promise = require('bluebird');
var path = require('path')

var fs = Promise.promisifyAll(require('fs'));

const deleteFile = (file) => { 
    return fs.unlink(file, (err) =>{
    })
}

const unPatchFiles = (patchedFilePath, backupFilePath) =>{
    let contents
    return fs.readFileAsync(backupFilePath, "utf8")
        .then((_contents) => {
            contents = _contents
            return fs.writeFileAsync(patchedFilePath, contents, {})
        })
        .then(() =>{
            return deleteFile(backupFilePath)
        })
}

let patchFilePath = path.resolve(__dirname, '../../../../../migrations/2_deploy_contracts.js')
let backupPath = path.resolve(__dirname, '../../../../../migrations/2_deploy_contracts.js.transmute.bak')

const unpatchMigrations = () =>{
    unPatchFiles(patchFilePath, backupPath)
}
 
module.exports = {
    unpatchMigrations
}