

import {
    getItem,
    setItem
} from './LocalStorage'

/**
 * @typedef {Persistence} EVENT_SCHEMAS
 * @method {getItem} returns an object by key from storage
 * @method {setItem} saves an object by key to storage
 */
export const Persistence = {
    getItem,
    setItem
}
