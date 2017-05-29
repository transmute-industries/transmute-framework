import { EventStore } from '../EventStore'
import { Persistence } from '../Persistence/Persistence'
import { EventTypes } from '../EventTypes/EventTypes'

export module ReadModel {

    export interface IReadModel {
        lastEvent: number;
        readModelType: string;
        readModelStoreKey: string;
        contractAddress: string;
        model: any;
    }

    /**
    * @type {Function} readModelGenerator - transform an event stream into a json object
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @param {Object[]} events - events from an es contract
    */
    export const readModelGenerator = (readModel: IReadModel, reducer: any, events: Array<EventTypes.ITransmuteEvent>) => {
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
        return Persistence.LocalStore.getItem(readModel.readModelStoreKey)
            .then(async (_readModel: IReadModel) => {
                if (!_readModel) {
                    _readModel = readModel
                }
                if (_readModel.lastEvent === solidityEventCount) {
                    return false
                }
                let events = await EventStore.readEvents(es, _readModel.lastEvent || 0)
                let updatedReadModel = readModelGenerator(_readModel, reducer, events)
                return Persistence.LocalStore.setItem(updatedReadModel.readModelStoreKey, updatedReadModel)
            })
    }

    
}