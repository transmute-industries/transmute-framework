'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const env_1 = require("../env");
const contract = require('truffle-contract');
const eventStoreArtifacts = require('../../build/contracts/EventStore');
const Middleware_1 = require("./Middleware/Middleware");
const ReadModel_1 = require("../ReadModel/ReadModel");
var EventStore;
(function (EventStore) {
    EventStore.ReadModelGenerator = ReadModel_1.ReadModel;
    EventStore.ES = contract(eventStoreArtifacts);
    EventStore.ES.setProvider(env_1.web3.currentProvider);
    EventStore.readEvent = (es, eventId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Middleware_1.Middleware.readSolidityEventAsync(es, eventId);
    });
    EventStore.readEvents = (es, eventId = 0) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let currentEvent = yield es.solidityEventCount();
        let eventPromises = [];
        while (eventId < currentEvent) {
            eventPromises.push(yield EventStore.readEvent(es, eventId));
            eventId++;
        }
        return yield Promise.all(eventPromises);
    });
    EventStore.writeEvent = (es, transmuteEvent, fromAddress) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let meta = {
            from: fromAddress,
            gas: 2000000
        };
        return yield Middleware_1.Middleware.writeSolidityEventAsync(es, meta, transmuteEvent);
    });
    EventStore.writeEvents = (es, eventArray, fromAddress) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let eventPromises = eventArray
            .map((transmuteEvent) => {
            return EventStore.writeEvent(es, transmuteEvent, fromAddress);
        });
        return yield Promise.all(eventPromises)
            .then((newEvents) => {
            return newEvents;
        });
    });
})(EventStore = exports.EventStore || (exports.EventStore = {}));
