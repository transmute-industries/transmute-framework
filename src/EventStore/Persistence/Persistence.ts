import { ITransmuteFramework } from '../../transmute-framework'

import { LocalStore } from './LocalStore/LocalStore'
import FireStore from './FireStore'

export default class Persistence {
  store: any
  constructor(public framework: ITransmuteFramework) {
    if (!framework.firebase) {
      this.store = LocalStore
    } else {
      let db = framework.firebase.firestore()
      this.store = new FireStore(db)
    }
  }

  get(key: string) {
    return this.store.getItem(key)
  }

  set(key: string, value: any) {
    return this.store.setItem(key, value)
  }
}
