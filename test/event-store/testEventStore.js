const { firebaseConfig } = require('../../env')
var EventStore = artifacts.require('./EventStore.sol')

const { 
  event,
  eventStream
} = require('./constants')

const {
  convertUIntArray,
  emitEventStream,
  eventsFromTransaction,
  readEvent,
  readEvents,
  readEventsStartingAt
} = require('./eventStore')

const {
  readModelStorePath,
  receiveEvents,
  rebuildReadModelWithGenerator,
  maybeSyncReadModel
} = require('./firebaseStore')

contract('EventStore', (accounts) => {

  let readModel = {
    Id: '0',
    EventCount: null,
    Name: '',
    Users: [],
    Milestones: [],
  }

  it('test deployed', () => {
    return EventStore.deployed()
    .then((_esInstance) => {
      return _esInstance
    })
  })

  it('test version', () => {
    return EventStore.deployed()
    .then((_esInstance) => {
      return _esInstance.getVersion()
    })
    .then((versionBigNum) => {
      let version = versionBigNum.toNumber()
      assert(version === 1)
    })
  })

  describe('emitEvent', () => {
    it('emits a NEW_EVENT', () => {
      return EventStore.deployed()
      .then((_esInstance) => {
        return _esInstance
        .emitEvent(event.Type, event.AddressValue, event.UIntValue, event.StringValue, {
          from: accounts[0],
          gas: 2000000
        })
      })
      .then((tx) => {
        let events = eventsFromTransaction(tx)
        // console.log(events)
        assert.equal(events.length, 1)
        assert.equal(events[0].Type, event.Type)
        assert.equal(events[0].AddressValue, event.AddressValue)
        assert.equal(events[0].UIntValue, event.UIntValue)
        assert.equal(events[0].StringValue, event.StringValue)
      })
    })
  })

  describe('readEvent', () => {
    it('should return the event object', () => {
      return EventStore.deployed()
      .then((_esInstance) => {
        return readEvent(_esInstance, 0)
      })
      .then((eventObject) => {
        // console.log('eventObject: ', eventObject)
        assert.equal(eventObject.Type, event.Type)
        assert.equal(eventObject.AddressValue, event.AddressValue)
        assert.equal(eventObject.UIntValue, event.UIntValue)
        assert.equal(eventObject.StringValue, event.StringValue)
      })
    })
  })

  describe('readEvents', () => {
    it('should return all event objects', () => {
      return EventStore.deployed()
      .then((_esInstance) => {
        return readEvents(_esInstance)
      })
      .then((eventObjects) => {
        // console.log('eventObjects: ', eventObjects)
        assert.equal(eventObjects.length, 1)
        let eventObject = eventObjects[0]
        assert.equal(eventObject.Type, event.Type)
        assert.equal(eventObject.AddressValue, event.AddressValue)
        assert.equal(eventObject.UIntValue, event.UIntValue)
        assert.equal(eventObject.StringValue, event.StringValue)
      })
    })
  })

  describe('Ethereum Event IO', () => {

    describe('emitEventStream', () => {
      it('should emit events on the contract for each event in the array (write stream to ethereum)', () => {

        return EventStore.deployed()
        .then((_esInstance) => {
          return emitEventStream(_esInstance, eventStream, accounts[0])
        })
        .then((events) => {
          assert.equal(events.length, 3)
          return events
          // let eventObject = eventObjects[0]
          // assert.equal(eventObject.Type, event.Type)
          // assert.equal(eventObject.AddressValue, event.AddressValue)
          // assert.equal(eventObject.UIntValue, event.UIntValue)
          // assert.equal(eventObject.StringValue, event.StringValue)
        })
      })
    })

    describe('readEventsStartingAt', () => {
      it('should return all events on the contract starting at eventId, (read stream from ethereum)', () => {
        return EventStore.deployed()
        .then(async (_esInstance) => {
          return await readEventsStartingAt(_esInstance, 2)
        })
        .then((events) => {
          assert.equal(events.length, 2)
          return events
          // let eventObject = eventObjects[0]
          // assert.equal(eventObject.Type, event.Type)
          // assert.equal(eventObject.AddressValue, event.AddressValue)
          // assert.equal(eventObject.UIntValue, event.UIntValue)
          // assert.equal(eventObject.StringValue, event.StringValue)
        })
      })
    })
  })

  describe('Firebase Event IO', () => {

    describe('receiveEvents', () => {
      it('should write events to firebase', () => {
        return receiveEvents(eventStream)
        .then(() => {
          // console.log('verify the events are in firebase here...')
        })
      })
    })

    describe('rebuildReadModelWithGenerator', () => {
      it('should apply events to generator yielding a readmodel', () => {
        let someEvents = eventStream.splice(0, 2)
        return rebuildReadModelWithGenerator(readModel, projectReadModelGenerator, someEvents)
      })
    })

    describe('maybeSyncReadModel', () => {
      it('should retrieve a read model and sync any missing events from the contract', () => {

        return EventStore.deployed()
        .then((esInstance) => {
          return maybeSyncReadModel(readModelStorePath, '0', projectReadModelGenerator, esInstance)
        })
        .then((didUpdate) => {
          // console.log('didUpdate: ', didUpdate)
        })
      })
    })
  })

  const projectReadModelGenerator = (readModel, events) => {
    events.forEach((event) => {
      if (event.Type === 'PROJECT_CREATED') {
        readModel = Object.assign({}, readModel, {
          Name: event.StringValue
        })
      }
      if (event.Type === 'PROJECT_JOINED') {
        if (!readModel.Users) {
          readModel.Users = []
        }
        readModel = Object.assign({}, readModel, {
          Users: readModel.Users.concat(event.StringValue)
        })
      }
      if (event.Type === 'PROJECT_MILESTONE') {
        if (!readModel.Milestones) {
          readModel.Milestones = []
        }
        readModel = Object.assign({}, readModel, {
          Milestones: readModel.Milestones.concat(event.StringValue)
        })
      }
      // Important for synching state
      readModel.EventCount = event.Id
    })
    return readModel
  }
})
