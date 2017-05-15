

import { Persistence } from './Persistence/Persistence'
import { EventTypes } from './EventTypes/EventTypes'
import { Transactions } from './Transactions/Transactions'
import { EventStore } from './EventStore/EventStore'
import { ReadModel } from './ReadModel/ReadModel'
import { TransmuteLogic } from './TransmuteLogic/TransmuteLogic'

export const TransmuteFramework = {
  Persistence,
  EventTypes,
  Transactions,
  EventStore,
  ReadModel,
  TransmuteLogic
}

export default TransmuteFramework

