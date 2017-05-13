var Promise = require('bluebird');

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

const unpatchMigrations = () =>{
    let patchFilePath = '../migrations/2_deploy_contracts.js'
    let backupPath = '../migrations/2_deploy_contracts.js.transmute.bak'
    unPatchFiles(patchFilePath, backupPath)
}
 
module.exports = {
    unpatchMigrations
}