var Constants = require('./constants')

// https://github.com/reactjs/redux/blob/master/docs/recipes/reducers/ImmutableUpdatePatterns.md

const readModel = {
  readModelStoreKey: '', // readModelType:contractAddress
  readModelType: 'EventStore', 
  contractAddress: '0x0000000000000000000000000000000000000000',
  lastEvent: null, // Last Event Index Processed
  model: {
    lastCliCommand: null
  } // where all the updates from events will be made
}

// const addIndexedObject = (model, objType, objKey, obj) => {
//   return {
//     model: Object.assign({}, model, {
//       [objType]: {
//         [objKey]: obj,
//         ...model[objType]
//       }
//     })
//   }
// }

// const addObjectToIndexedObjectCollection = (
//   model,
//   objType,
//   objKey,
//   collectionType,
//   collectionKey,
//   obj
// ) => {
//   return {
//     model: Object.assign({}, model, {
//       ...model,
//       [objType]: {
//         ...model[objType],
//         [objKey]: {
//           ...model[objType][objKey],
//           [collectionType]: {
//             ...model[objType][objKey][collectionType],
//             [collectionKey]: obj
//           }
//         }
//       }
//     })
//   }
// }

const updatesFromMeta = (meta) => {
  return {
    lastEvent: meta.id
  }
}

const handlers = {

  [Constants.CLI_COMMAND_RECEIVED]: (state, action) => {
    let updatesToModel = Object.assign({}, state, {
      model: {
        lastCliCommand: action.payload
      }
    })
    let updatesToMeta = updatesFromMeta(action.meta)
    return Object.assign({}, state, updatesToModel, updatesToMeta)
  },

  [Constants.EVENT_STORE_ACCESS_REQUESTED]: (state, action) => {
    let updatesToModel = {}
    // addIndexedObject(state.model, 'patient', action.payload.patientId, action.payload)
    let updatesToMeta = updatesFromMeta(action.meta)
    return Object.assign({}, state, updatesToModel, updatesToMeta)
  },

  [Constants.EVENT_STORE_ACCESS_GRANTED]: (state, action) => {
    let updatesToModel = {}
    // addIndexedObject(state.model, 'patient', action.payload.patientId, action.payload)
    let updatesToMeta = updatesFromMeta(action.meta)
    return Object.assign({}, state, updatesToModel, updatesToMeta)
  },

  [Constants.EVENT_STORE_ACCESS_REVOKED]: (state, action) => {
    let updatesToModel = {}
    // addIndexedObject(state.model, 'patient', action.payload.patientId, action.payload)
    let updatesToMeta = updatesFromMeta(action.meta)
    return Object.assign({}, state, updatesToModel, updatesToMeta)
  },

}

const reducer = (state = readModel, action) => {
  // console.log('action: ', action)
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

module.exports = {
  readModel,
  reducer
}