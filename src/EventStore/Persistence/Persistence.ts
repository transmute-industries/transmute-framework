import { ITransmuteFramework } from '../../transmute-framework'

import { LocalStore } from './LocalStore/LocalStore'
import FireStore from './FireStore'

export default class Persistence {
  store: any
  constructor(public framework: ITransmuteFramework) {
    if (!framework.firebase) {
      this.store = LocalStore
    } else {
      this.store = new FireStore(framework.firebase.firestore())
    }
  }

  get(key: string) {
    return this.store.getItem(key)
  }

  set(key: string, value: any) {
    return this.store.setItem(key, value)
  }
}
