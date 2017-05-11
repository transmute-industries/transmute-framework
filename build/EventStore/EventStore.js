'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const env_1 = require("../env");
const contract = require('truffle-contract');
const eventStoreArtifacts = require('../../build/contracts/EventStore');
var ES = contract(eventStoreArtifacts);
ES.setProvider(env_1.web3.currentProvider);
const Middleware_1 = require("./Middleware/Middleware");
exports.readEvent = (es, eventId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return Middleware_1.Middleware.readSolidityEventAsync(es, eventId);
});
exports.readEvents = (es, eventId = 0) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let currentEvent = yield es.solidityEventCount();
    let eventPromises = [];
    while (eventId < currentEvent) {
        eventPromises.push(yield exports.readEvent(es, eventId));
        eventId++;
    }
    return yield Promise.all(eventPromises);
});
exports.writeEvent = (es, transmuteEvent, fromAddress) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let meta = {
        from: fromAddress,
        gas: 2000000
    };
    return yield Middleware_1.Middleware.writeSolidityEventAsync(es, meta, transmuteEvent);
});
exports.writeEvents = (es, eventArray, fromAddress) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let eventPromises = eventArray
        .map((transmuteEvent) => {
        return exports.writeEvent(es, transmuteEvent, fromAddress);
    });
    return yield Promise.all(eventPromises)
        .then((newEvents) => {
        return newEvents;
    });
});
exports.EventStore = {
    ES,
    readEvent: exports.readEvent,
    readEvents: exports.readEvents,
    writeEvent: exports.writeEvent,
    writeEvents: exports.writeEvents
};
