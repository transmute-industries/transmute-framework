// import TransmuteFramework from '../../TransmuteFramework'

export const readModel = {
    readModelStoreKey: '', // readModelType:contractAddress
    readModelType: 'Permissions',
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
    ['AC_ROLE_ASSIGNED']: (state, action) => {
        let updatesToModel = {
            model: {}
        }
        let updatesToMeta = updatesFromMeta(action.meta)
        return Object.assign({}, state, updatesToModel, updatesToMeta)
    },
    ['AC_GRANT_WRITTEN']: (state, action) => {
        let updatesToModel = {
            model: {}
        }
        let updatesToMeta = updatesFromMeta(action.meta)
        return Object.assign({}, state, updatesToModel, updatesToMeta)
    },
}

export const reducer = (state = readModel, action) => {
    // console.log(action)
    if (handlers[action.type]) {
        return handlers[action.type](state, action)
    }
    return state
}