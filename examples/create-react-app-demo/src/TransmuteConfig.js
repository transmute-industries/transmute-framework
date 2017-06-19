import TransmuteFramework from 'transmute-framework'

const eventStoreArtifacts = require('transmute-framework/build/contracts/EventStore')
const eventStoreFactoryArtifacts = require('transmute-framework/build/contracts/EventStoreFactory')

export default TransmuteFramework.init({
    env: 'testrpc',
    esa: eventStoreArtifacts,
    esfa: eventStoreFactoryArtifacts
})