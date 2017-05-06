
/**
 * @param {EventStore} readModel - a json object representing the state of a given model
 * @param {projectReducer} reducer - a function which reduces events into a read model state object
 * @param {NEW_EVENT[]} events - events from an es contract
 */
export const readModelGenerator = (readModel, reducer, events) => {
    events.forEach((event) => {
        readModel = reducer(readModel, event)
    })
    return readModel
}
