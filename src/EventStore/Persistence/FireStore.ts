import * as _ from 'lodash'
export default class FireStore {
  db: any
  constructor(db) {
    this.db = db
  }

  getItem(key: string) {
    console.log('getItem deconstruct key to collection + id', key)
    // return this.db.collection(readModelType).doc(contractAddress).get().then(doc => {
    //   return doc.data()
    // })
  }

  setItem(key: string, value: any) {
    console.log('setItem deconstruct key to collection + id', key)
    // console.log("setting read model");
    // if (
    //   !_.every(
    //     _.map([readModel.readModelType, readModel.contractAddress], value => {
    //       return value !== undefined && value !== null && value !== ''
    //     })
    //   )
    // ) {
    //   throw Error('readModel missing readModelType or contractAddress. ' + JSON.stringify(readModel))
    // }
    // return this.db.collection(readModel.readModelType).doc(readModel.contractAddress).set(readModel)
  }
}
