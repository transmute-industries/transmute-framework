// "use strict";
// /**
//  * Ethereum Smart Contract Framework
//  * @module TransmuteFramework
//  */

// const firebase = require('firebase');
// const config = require('../../config');

// /** Class representing the TransmuteFramework. */
// class TransmuteFramework {

//     /**
//      * Create a TransmuteFramework.
//      */
//     constructor() {

//         this.initializeFirebase();
//     }

//     /**
//     * Connect to Firebase
//     * {@link https://firebase.google.com/docs/database/server/start Firebase Server API}.
//     */
//     initializeFirebase() {

//         this.config = config;

//         firebase.initializeApp(this.config.firebase);

//     }

// }

// module.exports = TransmuteFramework;