import { EventStore } from '../EventStore'
import { Persistence } from '../Persistence'

/**
* @param {EventStore} readModel - a json object representing the state of a given model
* @param {projectReducer} reducer - a function which reduces events into a read model state object
* @param {NEW_EVENT[]} events - events from an es contract
*/
export const readModelGenerator = (readModel, reducer, events) => {
  events.forEach((event) => {
    readModel = reducer(readModel, event)
  })
  return readModel
}

/**
* @param {EventStore} es - a contract instance which is an Event Store
* @param {initialProjectState} readModel - a json object representing the state of a given model
* @param {projectReducer} reducer - a function which reduces events into a read model state object
* @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
*/
export const maybeSyncReadModel = async (es, readModel, reducer) => {
  let eventCount = (await es.eventCount()).toNumber()
  return Persistence.getItem(readModel.ReadModelStoreKey)
  .then(async (_readModel) => {
    if (!_readModel) {
      _readModel = readModel
    }
    if (_readModel.EventCount === eventCount) {
      return false
    }
    let events = await EventStore.readEvents(es, _readModel.EventCount || 0)
    let updatedReadModel = readModelGenerator(_readModel, reducer, events)
    return Persistence.setItem(updatedReadModel.ReadModelStoreKey, updatedReadModel)
  })
}

export const ReadModel = {
  readModelGenerator,
  maybeSyncReadModel
}
