import { Middleware } from '../Middleware/Middleware'
import { Persistence } from '../Persistence/Persistence'
import { EventTypes } from '../EventTypes/EventTypes'

export module ReadModel {

    /**
    * @type {Function} readModelGenerator - transform an event stream into a json object
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @param {Object[]} events - events from an eventStore contract
    */
    export const readModelGenerator = (readModel: EventTypes.IReadModel, reducer: any, events: Array<EventTypes.ITransmuteEvent>): EventTypes.IReadModel => {
        events.forEach((event) => {
            readModel = reducer(readModel, event)
        })
        return <EventTypes.IReadModel> readModel
    }

    /**
    * @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
    * @param {Contract} eventStore - a contract instance which is an Event Store
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
    */
    export const maybeSyncReadModel = async (eventStore: any, fromAddress: string, readModel: EventTypes.IReadModel, reducer: any): Promise<EventTypes.IReadModel> => {
        // console.log('called: ')
        let solidityEventCount = (await eventStore.solidityEventCount()).toNumber()
        // console.log('solidityEventCount: ', solidityEventCount)
        return Persistence.LocalStore.getItem(readModel.readModelStoreKey)
            .then(async (_readModel: EventTypes.IReadModel) => {
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