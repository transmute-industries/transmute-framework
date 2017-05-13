var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));

let frameworkName = 'Transmute Framework'

let patchBegin = `🦄 ${frameworkName}`
let patchEnd = `🐩 ${frameworkName}`

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const backupPatchTarget = (targetPath) =>{
    let contents
    return fs.readFileAsync(targetPath, "utf8")
        .then((_contents) => {
            contents = _contents
            return fs.writeFileAsync(targetPath + '.transmute.bak', contents, {})
        })
        .then(() =>{
            return contents
        })
}

const buildPatch = (fileString) =>{
    // Fix path to match result of copyTransmuteContracts
    fileString = fileString.replace(/\.\//g, "./TransmuteFramework/");
    // convert deployer
    fileString = fileString.replace(/module\.exports/g, "const transmuteDeployer");
    fileString = `// BEGIN ${patchBegin} \n` + fileString
    fileString = fileString + `// END ${patchEnd} \n`
    return fileString
}

const patchFileAsync = (targetPath, patchFileString) =>{
     return fs.readFileAsync(targetPath, "utf8")
        .then((contents) => {
            return  patchFileString + '\n' + contents
        })
        .then((contents) => {
            let target = 'module.exports = function(deployer) {'
            let patchCall = '\ttransmuteDeployer(deployer)\n'
            let comment = '\t// Patched by Transmute Framework\n'
            let patch =  target + '\n' + comment + patchCall
            return contents = contents.replace(target, patch);
        })
        .then((result) => {
            return fs.writeFileAsync(targetPath, result, {})
        })
}

const patchMigrations = () =>{
    let patchTargetPath = '../migrations/2_deploy_contracts.js'
    backupPatchTarget(patchTargetPath)
        .then( (contents) =>{

            if (contents.indexOf(patchBegin) !== -1){
                throw Error('Already patched, aborting... consider unpatch')
            } else {
                return buildPatch(contents)
            }

        })
        .then((patch) => {
            return patchFileAsync(patchTargetPath, patch)
            // console.log("PATCH", result);
        }) 
}
 
module.exports = {
    patchMigrations
}
