
import {keys, pick, omit, flatten, difference, extend} from 'lodash'
import { web3 } from '../../env'

var {
    SOLIDITY_EVENT_SCHEMA
} = require('../EventTypes')

var {
    eventsFromTransaction
} = require('../Transactions')


const solidityEventProperties = keys(SOLIDITY_EVENT_SCHEMA)

const objectToSolidityEvent = (_obj) => {
    return pick(_obj, solidityEventProperties)
}

const objectToSolidityEventProperties = (_obj) => {
    return omit(_obj, solidityEventProperties)
}

const writeSolidityEventHelper = async (_esInstance, _callerMeta, _type, _propCount, _integrity) => {
    return await _esInstance.writeSolidityEvent(_type, _propCount, _integrity, _callerMeta)
}

const writeSolidityEventPropertyHelper = async (
    _esInstance,
    _callerMeta,
    _eventIndex,
    _eventPropertyIndex,
    _name,
    _type,
    _address,
    _uint,
    _string
    ) => {
    return await _esInstance.writeSolidityEventProperty(
        _eventIndex,
        _eventPropertyIndex,
        _name,
        _type,
        _address,
        _uint,
        _string,
        _callerMeta
    )
}

const guessType = (value) => {
    if (typeof value === 'string') {
        if (web3.isAddress(value)) {
            return 'Address'
        }
        return 'String'
    }
    if (typeof value === 'number') {
        return 'BigNumber'
    }
    return null
}

const writePropsToEvent = async (_es, _callerMeta, _event, _eventProps) => {
    let propKeys = keys(_eventProps)
    let promises = []
    let propIndex = 0
    while (propIndex < propKeys.length) {
        let pp
        let wp = writeSolidityEventPropertyHelper
        let key = propKeys[propIndex]
        let value = _eventProps[key]
        let propType = guessType(value)
        switch (propType) {
            case 'String': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, 0, value); break
            case 'BigNumber': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, value, ''); break
            case 'Address': pp = await wp(_es, _callerMeta, _event.Id, propIndex, key, propType, value, 0, ''); break
        }
        promises.push(pp)
        propIndex++
    }
    return promises
}

const hasRequiredProps = (eventObj) =>{
    let ownProps = difference(solidityEventProperties, keys(eventObj))
    //  Expect [ 'Created' ]
    if (ownProps.length === 1 && ownProps[0] === 'Created') {
        return true
    }
    throw Error('Event does not contain required properties: ', solidityEventProperties)
}

// Needs work... This function parses the events we have extracted from tx logs (multiple txs)
// It then reconstructs the original event from the logs
// dangerous if other events are fireing in the tx, consider a string property on both event and prop event types
export const solidityEventReducer = (events) =>{
    // console.log('rebuild the event here...', events)
    let _event = {}
    events.forEach((event) =>{
        // NOT GOOD way of determing even type...
        if (event.Type && event.Created) {
            extend(_event, event)
        } else {
            switch(event.Type) {
                case 'String': _event[event.Name] = event.StringValue; break
                case 'BigNumber': _event[event.Name] = event.UIntValue; break
                case 'Address': _event[event.Name] = event.AddressValue; break
            }
        }
    })
    return _event
}

const writeSolidityEventAsync = async (esInstance, _callerMeta, event) => {

    // TODO: Add check to make sure event does not contain reserved keys, throw error if so

    // danger hashing stringified objects may not be safe...
    event.IntegrityHash = web3.sha3(JSON.stringify(event))
    event.PropertyCount = difference(keys(event), solidityEventProperties).length

    hasRequiredProps(event)

    let _solEvent = objectToSolidityEvent(event)
    let _solEventProps = objectToSolidityEventProperties(event)
    let allEvents = []
    let wp = writeSolidityEventHelper
    return wp(esInstance, _callerMeta, _solEvent.Type, _solEvent.PropertyCount, _solEvent.IntegrityHash)
        .then((tx) => {
            let _events = eventsFromTransaction(tx)
            let event = _events[0]
            allEvents.push(event)
            return event
        })
        .then((_event) => {
            return writePropsToEvent(esInstance, _callerMeta, _event, _solEventProps)
        })
        .then((txs) => {
            let dirtyEvents = txs.map((tx) => {
                return eventsFromTransaction(tx)
            })
            let propEvents = flatten(dirtyEvents)
            allEvents = allEvents.concat(propEvents)
            let reconstructedEvent = solidityEventReducer(allEvents)
            return reconstructedEvent
        })
}

const writeSolidityEventsAsync = async (esInstance, _callerMeta, _events) => {
    return Promise.all(_events.map(async (_event) =>{
        return await writeSolidityEventAsync(esInstance, _callerMeta, _event)
    }))
}

const readSolidityEventHelper = async (esInstance, eventId) => {
    return {
        Id: eventId,
        Type: (await esInstance.readSolidityEventType.call(eventId)).toString(),
        Created: (await esInstance.readSolidityEventCreated.call(eventId)).toNumber(),
        IntegrityHash: (await esInstance.readSolidityEventIntegrityHash.call(eventId)).toString(),
        PropertyCount: (await esInstance.readSolidityEventPropertyCount.call(eventId)).toNumber(),
    }
}

const readSolidityEventPropertyHelper = async (esInstance, eventId, propIndex) => {
    return {
        Id: eventId,
        EventPropertyIndex: propIndex,
        Name: (await esInstance.readSolidityEventPropertyName.call(eventId, propIndex)).toString(),
        Type: (await esInstance.readSolidityEventPropertyType.call(eventId, propIndex)).toString(),
        AddressValue: (await esInstance.readSolidityEventPropertyAddressValue.call(eventId, propIndex)).toString(),
        UIntValue: (await esInstance.readSolidityEventPropertyUIntValue.call(eventId, propIndex)).toNumber(),
        StringValue: (await esInstance.readSolidityEventPropertyStringValue.call(eventId, propIndex)).toString()
    }
}

const solidityEventPropertyToObject = (prop) => {
    let _obj = {}
    switch (prop.Type) {
        case 'String': _obj[prop.Name] = prop.StringValue; break
        case 'BigNumber': _obj[prop.Name] = prop.UIntValue; break
        case 'Address': _obj[prop.Name] = prop.AddressValue; break
    }
    return _obj
}

const readSolidityEventAsync = async (esInstance, eventId) => {
    let event = await readSolidityEventHelper(esInstance, eventId)
    let propIndex = 0
    let props = []
    while (propIndex < event.PropertyCount) {
        let prop = await readSolidityEventPropertyHelper(esInstance, eventId, propIndex)
        props.push(prop)
        propIndex++
    }
    props.forEach((prop) => {
        let propObj = solidityEventPropertyToObject(prop)
        event = Object.assign({}, event, propObj)
    })
    return event
}

const readSolidityEventsAsync = async (esInstance, eventId = 0) => {
  let currentEvent = await esInstance.solidityEventCount()
  let eventPromises = []
  while (eventId < currentEvent) {
    eventPromises.push(await readSolidityEventAsync(esInstance, eventId))
    eventId++
  }
  return await Promise.all(eventPromises)
}

export const Middleware = {
    readSolidityEventAsync,
    readSolidityEventsAsync,
    writeSolidityEventAsync,
    writeSolidityEventsAsync
}
