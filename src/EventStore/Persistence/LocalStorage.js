
let store

if (typeof localStorage === 'undefined' || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage
    store = new LocalStorage('./scratch')
} else {
    store = localStorage
}

/**
 * @param {String} key - a key for a stored object
 * @return {Object} a promise for the object at the given key
 */
export const getItem = (key) => {
    return new Promise((resolve, reject) => {
        let itemAsString = store.getItem(key)
        try {
            resolve(JSON.parse(itemAsString))
        } catch (e) {
            resolve(itemAsString)
        }
    })
}

/**
 * @param {String} key - a key for a stored object
 * @param {String} value - the object to be stored
 * @return {Object} a promise for the object at the given key
 */
export const setItem = (key, value) => {
    return new Promise((resolve, reject) => {
        store.setItem(key, JSON.stringify(value))
        resolve(value)
    })
}

