import { ITransmuteFramework } from "../../transmute-framework";

import * as Common from "../Utils/Common";

export class ReadModel {
  constructor(public framework: ITransmuteFramework) {}

  /**
     * @type {Function} readModelGenerator - transform an event stream into a json object
     * @param {Object} readModel - a json object representing the state of a given model
     * @param {Function} reducer - a function which reduces events into a read model state object
     * @param {Object[]} events - events from an eventStore contract
     */
  readModelGenerator = (
    readModel: Common.IReadModel,
    reducer: any,
    events: Array<Common.IFSAEvent>
  ): Common.IReadModel => {
    events.forEach(event => {
      readModel = reducer(readModel, event);
    });
    return <Common.IReadModel>readModel;
  };

  /**
    * @type {Function} maybeSyncReadModel - maybe update a json read model if it has new events
    * @param {Contract} eventStore - a contract instance which is an Event Store
    * @param {Object} readModel - a json object representing the state of a given model
    * @param {Function} reducer - a function which reduces events into a read model state object
    * @return {Promise<ReadModel, Error>} json object representing the state of a ReadModel for an EventStore
    */
  maybeSyncReadModel = async (
    eventStore: any,
    fromAddress: string,
    readModel: Common.IReadModel,
    reducer: any
  ): Promise<Common.IReadModel> => {
    // console.log('called: ')
    // let d = eventStore
    let eventCount = (await eventStore.eventCount.call({
      from: fromAddress
    })).toNumber();
    // console.log('eventCount: ', eventCount)
    return this.framework.Persistence.LocalStore
      .getItem(readModel.readModelStoreKey)
      .then(async (_readModel: Common.IReadModel) => {
        if (!_readModel) {
          _readModel = readModel;
        }
        if (_readModel.lastEvent === eventCount) {
          return readModel;
        }
        // console.log('_readModel: ', _readModel)
        let startIndex =
          _readModel.lastEvent !== null ? _readModel.lastEvent + 1 : 0;
        let events = await this.framework.EventStore.readFSAs(
          eventStore,
          fromAddress,
          startIndex
        );
        // console.log('events: ', events)
        let updatedReadModel = this.readModelGenerator(
          _readModel,
          reducer,
          events
        );
        return <any>this.framework.Persistence.LocalStore.setItem(
          updatedReadModel.readModelStoreKey,
          updatedReadModel
        );
      });
  };

  getCachedReadModel = async (
    eventStore: any,
    fromAddress: string,
    readModel: Common.IReadModel,
    reducer: any
  ) => {
    readModel.contractAddress = eventStore.address;
    readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`;
    readModel = await this.maybeSyncReadModel(
      eventStore,
      fromAddress,
      readModel,
      reducer
    );
    return readModel;
  };
}
