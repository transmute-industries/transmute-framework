
var Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var EventStore = artifacts.require('./EventStore.sol')

var _ = require('lodash')

const createMeshPointEventTransmuteEvent = {
    Id: 0,
    Type: 'MESHPOINT_CREATED',
    PropertyCount: 2,
    Name: 'Coral',
    LocationPointer: 'firebase/location/pointer/0',
    IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689'
}

const solidityEventProperties = ['Id', 'Type', 'PropertyCount', 'IntegrityHash']

const solidityEventPropertyProperties = ['EventIndex', 'EventPropertyIndex']


const objectToSolidityEvent = (_obj) => {
    return _.pick(_obj, solidityEventProperties)
}

const objectToSolidityEventProperties = (_obj) => {
    return _.omit(_obj, solidityEventProperties)
}

const writeSolidityEventHelper = async (_esInstance, _callerMeta, _type, _propCount, _integrity) => {
    return await _esInstance.writeSolidityEvent(_type, _propCount, _integrity, _callerMeta)
}

const writeSolidityEventPropertyHelper = async (_esInstance, _callerMeta, _eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string) => {
    return await _esInstance.writeSolidityEventProperty(_eventIndex, _eventPropertyIndex, _name, _type, _address, _uint, _string, _callerMeta)
}

const SOLIDITY_EVENT_PROPERTY_SCHEMA = {
    EventIndex: 'BigNumber',
    EventPropertyIndex: 'BigNumber',
    Name: 'String',
    Type: 'String',
    
    AddressValue: 'String',
    UIntValue: 'BigNumber',
    StringValue: 'String'
}

 const SOLIDITY_EVENT_SCHEMA = {
    Id: 'BigNumber',
    Type: 'String',
    Created: 'BigNumber',
    IntegrityHash: 'String',

    PropertyCount: 'BigNumber'
}

const SOLIDITY_EVENT = 'SOLIDITY_EVENT'
const SOLIDITY_EVENT_PROPERTY = 'SOLIDITY_EVENT_PROPERTY'

const SCHEMAS = {
    [SOLIDITY_EVENT]: SOLIDITY_EVENT_SCHEMA,
    [SOLIDITY_EVENT_PROPERTY]: SOLIDITY_EVENT_PROPERTY_SCHEMA,
}

const PROP_SCHEMA = {
    Name: 'String',
    LocationPointer: 'String'
}

const getPropFromSchema = (propType, value) => {
    switch (propType) {
        case 'String': return value.toString()
        case 'Address': return value.toString()
        case 'BigNumber': return value.toNumber()
        default: throw Error(`UNKNWON propType ${propType} for value '${value}'. Make sure your schema is up to date.`)
    }
}

const eventFromLog = (log) => {
    let schema = SCHEMAS[log.event]
    let event = {}
    _.forIn(log.args, (value, key) => {
        let prop = getPropFromSchema(schema[key], value)
        _.extend(event, {
            [key]: prop
        })
    })
    return event
}

const eventsFromTransaction = (tx) => {
    return tx.logs.map((log) => {
        return eventFromLog(log)
    })
}

const writePropsToEvent = async (_es, _callerMeta, _event, _eventProps) =>{
 let propKeys = _.keys(_eventProps)
 let promises = []
 let propIndex = 0
 while(propIndex < propKeys.length){
    let propPromise
    let key = propKeys[propIndex]
    let propType = PROP_SCHEMA[key]
    let value = _eventProps[key]
    switch(propType){
        case 'String': propPromise = await writeSolidityEventPropertyHelper(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, 0, value); break;
        case 'BigNumber': propPromise = await writeSolidityEventPropertyHelper(_es, _callerMeta, _event.Id, propIndex, key, propType, 0, value, ''); break;
        case 'Address': propPromise = await writeSolidityEventPropertyHelper(_es, _callerMeta, _event.Id, propIndex, key, propType, value, 0, ''); break;
    }
    promises.push(propPromise)
    propIndex++
 }
 return promises
}

const writeSolidityEventAsync = async (esInstance, _callerMeta, event ) =>{

    let _solEvent = objectToSolidityEvent(event)
    let _solEventProps = objectToSolidityEventProperties(event)
    let allEvents = []
    return writeSolidityEventHelper(esInstance, _callerMeta, _solEvent.Type, _solEvent.PropertyCount, _solEvent.IntegrityHash) 
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
        let dirtyEvents = txs.map((tx) =>{
            return eventsFromTransaction(tx)
        })  
        let solEvents = _.flatten(dirtyEvents)
        allEvents = allEvents.concat(solEvents)
        return allEvents
    })
}

const readSolidityEventHelper = async (esInstance, eventId) =>{
    return {
        Id: eventId,
        Type: (await esInstance.readSolidityEventType.call(eventId)).toString(),
        Created: (await esInstance.readSolidityEventCreated.call(eventId)).toNumber(),
        IntegrityHash: (await esInstance.readSolidityEventIntegrityHash.call(eventId)).toString(),
        PropertyCount: (await esInstance.readSolidityEventPropertyCount.call(eventId)).toNumber(),
    }
}

const readSolidityEventPropertyHelper = async (esInstance, eventId, propIndex) =>{
    return {
        Id: eventId,
        EventPropertyIndex: propIndex,
        Name: (await esInstance.readSolidityEventPropertyName.call(eventId, propIndex)).toString(),
        Type: (await esInstance.readSolidityEventPropertyType.call(eventId, propIndex)).toString(),
        AddressValue: (await esInstance.readSolidityEventPropertyAddressValue.call(eventId, propIndex)).toString(),
        UIntValue: (await esInstance.readSolidityEventPropertyUIntValue.call(eventId, propIndex)).toNumber(),
        StringValue: (await esInstance.readSolidityEventPropertyStringValue.call(eventId, propIndex)).toString(),
    }
}

const solidityEventPropertyToObject = (prop) =>{
    let _obj = {}
    switch (prop.Type){
        case 'String' : _obj[prop.Name] = prop.StringValue; break;
        case 'BigNumber' : _obj[prop.Name] = prop.UIntValue; break;
        case 'Address' : _obj[prop.Name] = prop.AddressValue; break;
    }
    return _obj
}

const readSolidityEventAsync = async(esInstance, eventId) =>{
    let event = await readSolidityEventHelper(esInstance, eventId)
    let propIndex = 0
    let props = []
    while(propIndex < event.PropertyCount){
        let prop = await readSolidityEventPropertyHelper(esInstance, eventId, propIndex)
        props.push(prop)
        propIndex++
    }
    props.forEach((prop) =>{
            // console.log('prop12312312 ', prop)
        let propObj = solidityEventPropertyToObject(prop)
        // console.log(propObj)
        event = Object.assign({}, event, propObj)
    })
    // console.log('event...', event)
    return event
}

contract('EventStore', (accounts) => {

    describe('writeSolidityEventAsync', () => {
        it('writes a SOLIDITY_EVENT to the chain', () => {
            let event  = createMeshPointEventTransmuteEvent
            let _callerMeta = {
                from: accounts[0],
                gas: 2000000
            }
            return EventStore.deployed()
                .then((_esInstance) => {
                    return writeSolidityEventAsync(_esInstance, _callerMeta, event)
                })
                .then((allEvents) =>{
                    // console.log(allEvents)
                    return true
                })
        })
    })

    describe('readSolidityEventAsync', () => {
        it('return a SOLIDITY_EVENT at the givent Id', () => {

            return EventStore.deployed()
                .then((_esInstance) => {
                    return readSolidityEventAsync(_esInstance, 0)
                })
                .then((event) =>{
                    // console.log(event)
                    return true
                })
        })
    })

})
