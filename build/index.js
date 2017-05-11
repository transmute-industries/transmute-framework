"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventStore_1 = require("./EventStore/EventStore");
const Persistence_1 = require("./Persistence/Persistence");
const ReadModel_1 = require("./EventStore/ReadModel/ReadModel");
exports.TransmuteFramework = {
    EventStore: EventStore_1.EventStore,
    Persistence: Persistence_1.Persistence,
    ReadModel: ReadModel_1.ReadModel
};
