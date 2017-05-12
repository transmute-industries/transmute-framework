"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const { keys, pick, omit, flatten, difference, extend } = require('lodash');
const env_1 = require("../../env");
const EventTypes_1 = require("../../EventTypes/EventTypes");
const Transactions_1 = require("../../Transactions/Transactions");
const solidityEventProperties = keys(EventTypes_1.EventTypes.SolidityEventSchema);
const objectToSolidityEvent = (_obj) => {
    return pick(_obj, solidityEventProperties);
};
const objectToSolidityEventProperties = (_obj) => {
    return omit(_obj, solidityEventProperties);
};
const writeSolidityEventHelper = (_esInstance, _callerMeta, _type, _propCount, _integrity) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield _esInstance.writeSolidityEvent(_type, _propCount, _integrity, _callerMeta);
});
const writeSolidityEventPropertyHelper = (_esInstance, _callerMeta, _eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield _esInstance.writeSolidityEventProperty(_eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string, _callerMeta);
});
const guessType = (value) => {
    if (typeof value === 'string') {
        if (env_1.web3.isAddress(value)) {
            return 'Address';
        }
        return 'String';
    }
    if (typeof value === 'number') {
        return 'BigNumber';
    }
    return null;
};
const writePropsToEvent = (_es, _callerMeta, _event, _eventProps) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let propKeys = keys(_eventProps);
    let promises = [];
    let propIndex = 0;
    while (propIndex < propKeys.length) {
        let pp;
        let wp = writeSolidityEventPropertyHelper;
        let key = propKeys[propIndex];
        let value = _eventProps[key];
        let propType = guessType(value);
        switch (propType) {
            case 'String':
                pp = yield wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, 0, value);
                break;
            case 'BigNumber':
                pp = yield wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, value, '');
                break;
            case 'Address':
                pp = yield wp(_es, _callerMeta, _event.Id, propIndex, key, propType, value, 0, '');
                break;
        }
        promises.push(pp);
        propIndex++;
    }
    return promises;
});
const hasRequiredProps = (eventObj) => {
    let ownProps = difference(solidityEventProperties, keys(eventObj));
    if (ownProps.length === 1 && ownProps[0] === 'Created') {
        return true;
    }
    throw Error('Event does not contain required properties: ' + JSON.stringify(solidityEventProperties));
};
exports.solidityEventReducer = (events) => {
    let _event = {};
    events.forEach((event) => {
        if (event.Type && event.Created) {
            extend(_event, event);
        }
        else {
            switch (event.Type) {
                case 'String':
                    _event[event.Name] = event.StringValue;
                    break;
                case 'BigNumber':
                    _event[event.Name] = event.UIntValue;
                    break;
                case 'Address':
                    _event[event.Name] = event.AddressValue;
                    break;
            }
        }
    });
    return _event;
};
exports.writeSolidityEventAsync = (esInstance, _callerMeta, event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    event.PropertyCount = difference(keys(event), solidityEventProperties).length;
    event.IntegrityHash = env_1.web3.sha3(JSON.stringify(event));
    hasRequiredProps(event);
    let _solEvent = objectToSolidityEvent(event);
    let _solEventProps = objectToSolidityEventProperties(event);
    let allEvents = [];
    let wp = writeSolidityEventHelper;
    return wp(esInstance, _callerMeta, _solEvent.Type, _solEvent.PropertyCount, _solEvent.IntegrityHash)
        .then((tx) => {
        let _events = Transactions_1.Transactions.eventsFromTransaction(tx);
        let event = _events[0];
        allEvents.push(event);
        return event;
    })
        .then((_event) => {
        return writePropsToEvent(esInstance, _callerMeta, _event, _solEventProps);
    })
        .then((txs) => {
        let dirtyEvents = txs.map((tx) => {
            return Transactions_1.Transactions.eventsFromTransaction(tx);
        });
        let propEvents = flatten(dirtyEvents);
        allEvents = allEvents.concat(propEvents);
        let reconstructedEvent = exports.solidityEventReducer(allEvents);
        return reconstructedEvent;
    });
});
exports.writeSolidityEventsAsync = (esInstance, _callerMeta, _events) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return Promise.all(_events.map((_event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield exports.writeSolidityEventAsync(esInstance, _callerMeta, _event);
    })));
});
const readSolidityEventHelper = (esInstance, eventId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return {
        Id: eventId,
        Type: (yield esInstance.readSolidityEventType.call(eventId)).toString(),
        Created: (yield esInstance.readSolidityEventCreated.call(eventId)).toNumber(),
        IntegrityHash: (yield esInstance.readSolidityEventIntegrityHash.call(eventId)).toString(),
        PropertyCount: (yield esInstance.readSolidityEventPropertyCount.call(eventId)).toNumber()
    };
});
const readSolidityEventPropertyHelper = (esInstance, eventId, propIndex) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return {
        Id: eventId,
        EventPropertyIndex: propIndex,
        Name: (yield esInstance.readSolidityEventPropertyName.call(eventId, propIndex)).toString(),
        Type: (yield esInstance.readSolidityEventPropertyType.call(eventId, propIndex)).toString(),
        AddressValue: (yield esInstance.readSolidityEventPropertyAddressValue.call(eventId, propIndex)).toString(),
        UIntValue: (yield esInstance.readSolidityEventPropertyUIntValue.call(eventId, propIndex)).toNumber(),
        StringValue: (yield esInstance.readSolidityEventPropertyStringValue.call(eventId, propIndex)).toString()
    };
});
const solidityEventPropertyToObject = (prop) => {
    let _obj = {};
    switch (prop.Type) {
        case 'String':
            _obj[prop.Name] = prop.StringValue;
            break;
        case 'BigNumber':
            _obj[prop.Name] = prop.UIntValue;
            break;
        case 'Address':
            _obj[prop.Name] = prop.AddressValue;
            break;
    }
    return _obj;
};
exports.readSolidityEventAsync = (esInstance, eventId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let event = yield readSolidityEventHelper(esInstance, eventId);
    let propIndex = 0;
    let props = [];
    while (propIndex < event.PropertyCount) {
        let prop = yield readSolidityEventPropertyHelper(esInstance, eventId, propIndex);
        props.push(prop);
        propIndex++;
    }
    props.forEach((prop) => {
        let propObj = solidityEventPropertyToObject(prop);
        event = Object.assign({}, event, propObj);
    });
    return event;
});
exports.readSolidityEventsAsync = (esInstance, eventId = 0) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let currentEvent = yield esInstance.solidityEventCount();
    let eventPromises = [];
    while (eventId < currentEvent) {
        eventPromises.push(yield exports.readSolidityEventAsync(esInstance, eventId));
        eventId++;
    }
    return yield Promise.all(eventPromises);
});
exports.Middleware = {
    readSolidityEventAsync: exports.readSolidityEventAsync,
    readSolidityEventsAsync: exports.readSolidityEventsAsync,
    writeSolidityEventAsync: exports.writeSolidityEventAsync,
    writeSolidityEventsAsync: exports.writeSolidityEventsAsync
};
