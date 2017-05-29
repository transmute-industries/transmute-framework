import { Middleware } from '../Middleware/Middleware'
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
    * @param {Object[]} events - events from an eventStore contract
    */
    export const readModelGenerator = (readModel: IReadModel, reducer: any, events: Array<EventTypes.ITransmuteEvent>): IReadModel => {
        events.forEach((event) => {
            readModel = reducer(readModel, event)
        })
        return <IReadModel> readModel
    }

    /**
    * @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
    * @param {Contract} eventStore - a contract instance which is an Event Store
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
    */
    export const maybeSyncReadModel = async (eventStore: any, fromAddress: string, readModel: IReadModel, reducer: any): Promise<IReadModel> => {
        // console.log('called: ')
        let solidityEventCount = (await eventStore.solidityEventCount()).toNumber()
        // console.log('solidityEventCount: ', solidityEventCount)
        return Persistence.LocalStore.getItem(readModel.readModelStoreKey)
            .then(async (_readModel: IReadModel) => {
                if (!_readModel) {
                    _readModel = readModel
                }
                if (_readModel.lastEvent === solidityEventCount) {
                    return readModel
                }
                // console.log('_readModel: ', _readModel)
                let events = await Middleware.readTransmuteEvents(eventStore, fromAddress, _readModel.lastEvent || 0)
                // console.log('events: ', events)
                let updatedReadModel = readModelGenerator(_readModel, reducer, events)
                return <any> Persistence.LocalStore.setItem(updatedReadModel.readModelStoreKey, updatedReadModel)
            })
    }

    
}