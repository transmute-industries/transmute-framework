import { LocalStorage } from "./LocalStore/LocalStorage"
// import  { FirebaseStorage  }   from './FireStore/FirebaseStorage'

const moment = require("moment")

const DEBUG = false
const log = DEBUG ? console.log : () => {}

export namespace Persistence {
  export interface ICacheObject {
    expires: string // moment().toISOString()
    value: Object
  }
  export interface IPersistenceStore {
    getItem: (key: string) => Promise<Object>
    setItem: (key: string, value: Object) => Promise<Object>
  }
  export const LocalStore = LocalStorage
  export const FireStore = null

  /**
     * @param {String} key - a key for a stored object
     * @param {IPersistenceStore} store - the persistence method used for the cache
     * @return {Object} a promise for an empty object, the cache is expired
     */
  export const expireItem = (
    key: string,
    store: Persistence.IPersistenceStore = LocalStore
  ): Promise<Object> => {
    return new Promise((resolve, reject) => {
      let cacheObject = {
        expires: moment()
          .subtract(1, "second")
          .toISOString(),
        value: {}
      }
      store.setItem(key, cacheObject).then((data: ICacheObject) => {
        log("cache: " + key + " expired.")
        resolve(data.value)
      })
    })
  }

  /**
     * @param {String} key - a key for a stored object
     * @param {Object} value - a an object to be persisted
     * @param {String} expires - an ISO string for when the cache expires
     * @param {IPersistenceStore} store - the persistence method used for the cache
     * @return {Object} a promise for the object at the given key
     */
  export const setItem = (
    key: string,
    value: Object,
    expires: string = moment()
      .add(15, "seconds")
      .toISOString(),
    store: Persistence.IPersistenceStore = LocalStore
  ): Promise<Object> => {
    return new Promise((resolve, reject) => {
      let cacheObject = {
        expires: expires,
        value: value
      }
      store.setItem(key, cacheObject).then((data: ICacheObject) => {
        log("cache: " + key + " set.")
        resolve(data.value)
      })
    })
  }

  /**
     * @param {String} key - a key for a stored object
     * @param {IPersistenceStore} store - the persistence method used for the cache
     * @return {Object} a promise for the object at the given key
     */
  export const getItem = (
    key: string,
    store: Persistence.IPersistenceStore = LocalStore
  ): Promise<Object> => {
    return new Promise((resolve, reject) => {
      store.getItem(key).then((data: ICacheObject) => {
        if (moment().isAfter(moment(data.expires))) {
          log("cache: " + key + " has expired.")
          resolve(null)
        } else {
          log("cache: " + key + " hit.")
          resolve(data.value)
        }
      })
    })
  }
}
