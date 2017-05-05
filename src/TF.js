'use strict'

/**
 * Ethereum Smart Contract Framework
 * @module TransmuteFramework
 */

import * as firebase from 'firebase'
import { fbConfig } from '../config.js'

/** Class representing the TransmuteFramework. */
class TransmuteFramework {

  /**
   * Create a TransmuteFramework.
   */
  constructor() {
    this.config = {
      firebase: fbConfig
    }
    this.initializeFirebase()
  }

  /**
  * Connect to Firebase
  * {@link https://firebase.google.com/docs/database/server/start Firebase Server API}.
  */
  initializeFirebase() {
    firebase.initializeApp(this.config.firebase)
  }

}

export default new TransmuteFramework()
