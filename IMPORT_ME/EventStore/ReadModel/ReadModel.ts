import { EventStore } from '../EventStore'
import { Persistence } from '../../Persistence/Persistence'

export interface IReadModel {
  LastEvent: number;
  ReadModelStoreKey: string;
}

/**
* @type {Function} readModelGenerator - transform an event stream into a json object
* @param {Object} readModel - a json object representing the state of a given model
* @param {Function} reducer - a function which reduces events into a read model state object
* @param {Object[]} events - events from an es contract
*/
export const readModelGenerator = (readModel: IReadModel, reducer: any, events: Object[]) => {
  events.forEach((event) => {
    readModel = reducer(readModel, event)
  })
  return readModel
}

/**
* @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
* @param {Contract} es - a contract instance which is an Event Store
* @param {Object} readModel - a json object representing the state of a given model
* @param {Function} reducer - a function which reduces events into a read model state object
* @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
*/
export const maybeSyncReadModel = async (es: any, readModel: IReadModel, reducer: any) => {
  let solidityEventCount = (await es.solidityEventCount()).toNumber()
  return Persistence.getItem(readModel.ReadModelStoreKey)
    .then(async (_readModel: IReadModel) => {
      if (!_readModel) {
        _readModel = readModel
      }
      if (_readModel.LastEvent === solidityEventCount) {
        return false
      }
      let events = await EventStore.readEvents(es, _readModel.LastEvent || 0)
      let updatedReadModel = readModelGenerator(_readModel, reducer, events)
      return Persistence.setItem(updatedReadModel.ReadModelStoreKey, updatedReadModel)
    })
}

/**
* @type {Object} ReadModel - tools for turning event streams into json objects
* @property {readModelGenerator} readModelGenerator - convert an event stream into a json object
* @property {maybeSyncReadModel} maybeSyncReadModel - update json object with lastet blockchain events
*/
export const ReadModel = {
  readModelGenerator,
  maybeSyncReadModel
}
