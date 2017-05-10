import {
  getItem,
  setItem
} from './LocalStorage'

/**
* @type {Object} Persistence
* @property {getItem} getItem - returns an object by key from storage
* @property {setItem} setItem - saves an object by key to storage
*/
export const Persistence = {
  getItem,
  setItem
}
