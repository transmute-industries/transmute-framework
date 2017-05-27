import { EventStore } from '../EventStore'
import { Persistence } from '../Persistence/Persistence'

export module ReadModel {

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
        return Persistence.LocalStore.getItem(readModel.ReadModelStoreKey)
            .then(async (_readModel: IReadModel) => {
                if (!_readModel) {
                    _readModel = readModel
                }
                if (_readModel.LastEvent === solidityEventCount) {
                    return false
                }
                let events = await EventStore.readEvents(es, _readModel.LastEvent || 0)
                let updatedReadModel = readModelGenerator(_readModel, reducer, events)
                return Persistence.LocalStore.setItem(updatedReadModel.ReadModelStoreKey, updatedReadModel)
            })
    }

    // http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
    export const flatten = (data) => {
        var result = {};
        function recurse (cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for(var i=0, l=cur.length; i<l; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                if (l == 0)
                    result[prop] = [];
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop+"."+p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(data, "");
        return result;
    }

    export const unflatten = (data: Object): Object => {
        if (Object(data) !== data || Array.isArray(data))
            return data;
        var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
            resultholder = {};
        for (var p in data) {
            var cur = resultholder,
                prop = "",
                m;
            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }
        return resultholder[""] || resultholder;
    }
}