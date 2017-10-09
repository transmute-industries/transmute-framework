
import TransmuteFramework from '../../../transmute-framework'

const firebase = require('firebase')
require('firebase/firestore')


let transmuteConfig = {
  providerUrl: 'http://localhost:8545',
  aca: require('../../../../build/contracts/RBAC.json'),
  esa: require('../../../../build/contracts/RBACEventStore.json'),
  esfa: require('../../../../build/contracts/RBACEventStoreFactory.json'),
  firebaseApp: firebase.initializeApp(require('../../../../../secrets/firebaseConfig.json')),
}

TransmuteFramework.init(transmuteConfig)

export default {
  TransmuteFramework,
}
