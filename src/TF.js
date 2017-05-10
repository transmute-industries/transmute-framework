import {
  EventStore
} from './EventStore/EventStore'

import {
  Persistence
} from './EventStore/Persistence'

import {
  ReadModel
} from './EventStore/ReadModel'


/**
* @typedef {Object} TF - transmute framework es6 module
* @method {EventStore} EventStore
* @method {Persistence} Persistence
* @method {ReadModel} ReadModel
*/
export const TF = {
  EventStore,
  Persistence,
  ReadModel
}



