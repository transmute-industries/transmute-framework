
const readModelGenerator = (readModel, reducer, events) => {
    events.forEach((event) => {
        readModel = reducer(readModel, event)
    })
    return readModel
}

export default {
    readModelGenerator
}
