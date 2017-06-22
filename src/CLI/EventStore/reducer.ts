import TransmuteFramework from '../../TransmuteFramework'


export const readModel = {
    readModelStoreKey: '', // readModelType:contractAddress
    readModelType: 'EventStore',
    contractAddress: '0x0000000000000000000000000000000000000000',
    lastEvent: null, // Last Event Index Processed
    model: {} // where all the updates from events will be made
}

const updatesFromMeta = (meta: any) => {
    return {
        lastEvent: meta.id
    }
}


const handlers = {

    ['CLI_COMMAND_RECEIVED']: (state, action) => {
        let updatesToModel = {
            model: {
                lastCommand: action.payload
            }
        }
        let updatesToMeta = updatesFromMeta(action.meta)
        return Object.assign({}, state, updatesToModel, updatesToMeta)
    },


}

export const reducer = (state = readModel, action) => {
    if (handlers[action.type]) {
        return handlers[action.type](state, action)
    }
    return state
}