
import {
  EventStore
} from './EventStore/EventStore'

import {
  Persistence
} from './Persistence/Persistence'

import {
  ReadModel,
  IReadModel
} from './EventStore/ReadModel/ReadModel'

/**
* @typedef {Object} TransmuteFramework - transmute framework es6 module
* @method {EventStore} EventStore
* @method {Persistence} Persistence
* @method {ReadModel} ReadModel
*/
export const TransmuteFramework = {
  EventStore,
  Persistence,
  ReadModel
}



