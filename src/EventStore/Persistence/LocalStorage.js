
let store

if (typeof localStorage === 'undefined' || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage
    store = new LocalStorage('./scratch')
} else {
    store = localStorage
}

const getItem = (key) => {
    return new Promise((resolve, reject) => {
        let itemAsString = store.getItem(key)
        try {
            resolve(JSON.parse(itemAsString))
        } catch (e) {
            resolve(itemAsString)
        }
    })
}

const setItem = (key, value) => {
    return new Promise((resolve, reject) => {
        store.setItem(key, JSON.stringify(value))
        resolve(value)
    })
}

export default {
    getItem,
    setItem
}

