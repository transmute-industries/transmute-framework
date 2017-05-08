import { Constants } from './constants'

export const initialProjectState = {
  ReadModelStoreKey: '', // CONTRACT_ADDRESS:READ_MODEL_NAME
  ReadModelType: '', // READ_MODEL_NAME
  ContractAddress: '', // CONTRACT_ADDRESS
  LastEvent: null,
  Name: '',
  Users: [],
  Milestones: []
}

const handlers = {
  [Constants.PROJECT_CREATED]: (state, transmuteEvent) => {
    return Object.assign({}, state, {
      Name: transmuteEvent.StringValue,
      LastEvent: transmuteEvent.id
    })
  },
  [Constants.PROJECT_JOINED]: (state, transmuteEvent) => {
    return Object.assign({}, state, {
      Users: state.Users.concat(transmuteEvent.StringValue),
      LastEvent: transmuteEvent.id
    })
  },
  [Constants.PROJECT_MILESTONE]: (state, transmuteEvent) => {
    return Object.assign({}, state, {
      Milestones: state.Milestones.concat(transmuteEvent.StringValue),
      LastEvent: transmuteEvent.id
    })
  }
}

export const projectReducer = (state = initialProjectState, transmuteEvent) => {
  // && transmuteEvent.Id > state.LastEvent
  if (handlers[transmuteEvent.Type]) {
    return handlers[transmuteEvent.Type](state, transmuteEvent)
  }
  return state
}
