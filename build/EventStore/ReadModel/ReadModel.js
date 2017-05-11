"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const EventStore_1 = require("../EventStore");
const Persistence_1 = require("../../Persistence/Persistence");
exports.readModelGenerator = (readModel, reducer, events) => {
    events.forEach((event) => {
        readModel = reducer(readModel, event);
    });
    return readModel;
};
exports.maybeSyncReadModel = (es, readModel, reducer) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let solidityEventCount = (yield es.solidityEventCount()).toNumber();
    return Persistence_1.Persistence.getItem(readModel.ReadModelStoreKey)
        .then((_readModel) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!_readModel) {
            _readModel = readModel;
        }
        if (_readModel.LastEvent === solidityEventCount) {
            return false;
        }
        let events = yield EventStore_1.EventStore.readEvents(es, _readModel.LastEvent || 0);
        let updatedReadModel = exports.readModelGenerator(_readModel, reducer, events);
        return Persistence_1.Persistence.setItem(updatedReadModel.ReadModelStoreKey, updatedReadModel);
    }));
});
exports.ReadModel = {
    readModelGenerator: exports.readModelGenerator,
    maybeSyncReadModel: exports.maybeSyncReadModel
};
