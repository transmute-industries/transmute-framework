

import { Persistence } from './Persistence/Persistence'
import { EventTypes } from './EventTypes/EventTypes'
import { Transactions } from './Transactions/Transactions'
import { EventStore } from './EventStore/EventStore'
import { ReadModel } from './ReadModel/ReadModel'
import { TransmuteLogic } from './TransmuteLogic/TransmuteLogic'
import { EventStoreFactory } from './EventStoreFactory/EventStoreFactory'

export const TransmuteFramework = {
  Persistence,
  EventTypes,
  Transactions,
  EventStore,
  EventStoreFactory,
  ReadModel,
  TransmuteLogic
}

export default TransmuteFramework

