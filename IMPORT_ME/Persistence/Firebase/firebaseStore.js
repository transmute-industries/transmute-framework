// const { firebaseConfig } = require('../../env')

// const firebase = require('firebase')
// const { readEventsStartingAt } = require('./eventStore')

// firebase.initializeApp(firebaseConfig)

// const db = firebase.database()
// const eventStorePath = 'transmute/events/'
// const readModelStorePath = 'transmute/models/'

// // // TODO: Add Encryption here
// // // to hide contract data from firebase...
// // // store encryption key in a contract with owner
// // // https://github.com/cisco/node-jose
// // // https://github.com/OR13/JOE

// const getItem = async (storePath, key) => {
//   return db.ref(storePath + key)
//   .once('value')
//   .then((snapshot) => {
//     let obj = snapshot.val()
//     return obj
//   })
// }

// const setItem = async (storePath, key, value) => {
//   return db.ref(storePath + key).set(value)
// }


// module.exports = {
//   readModelStorePath,
//   receiveEvents,
//   rebuildReadModelWithGenerator,
//   maybeSyncReadModel
// }
