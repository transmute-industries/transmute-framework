import { firebaseConfig } from '../../config'
const firebase = require('firebase')

// // TODO: Add Encryption here
// // to hide contract data from firebase...
// // store encryption key in a contract with owner
// // https://github.com/cisco/node-jose
// // https://github.com/OR13/JOE

export module FirebaseStorage {
    
    export const storePath = 'store/'
    export let db
    export const init = (config = firebaseConfig) =>{
        firebase.initializeApp(firebaseConfig)
        db = firebase.database()
    }

    /**
     * @param {String} key - a key for a stored object
     * @return {Object} a promise for the object at the given key
     */
    export const getItem = (key: string): Promise<Object> => {
          if (db === undefined){
              throw Error('db is undefined. Be sure to call FireStore.init(config)')
          }
          return new Promise((resolve, reject) => {
            db.ref(storePath + key)
            .once('value')
            .then((snapshot) => {
                let obj = snapshot.val()
                resolve(obj)
            })
            .catch((err)=>{
                reject(err)
            })
        })
         
    }
    /**
     * @param {String} key - a key for a stored object
     * @param {Object} value - the object to be stored
     * @return {Object} a promise for the object at the given key
     */
    export const setItem = (key: string, value: Object): Promise<Object> => {
        if (db === undefined){
            throw Error('db is undefined. Be sure to call FireStore.init(config)')
        }
        return new Promise((resolve, reject) => {
            db.ref(storePath + key).set(value)
                .then(() =>{
                    resolve(value)
                })
                .catch((err) =>{
                    reject(err)
                })
        })
    }
}



