const meshPointEvent = {
    Id: 0,
    Type: 'MESHPOINT_CREATED',
    PropertyCount: 4,

    Name: 'Coral',
    LocationPointer: 'firebase/location/pointer/0',
    IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689',
    MaxConnections: 15,
    CreatorAddress: '0x438a938896fa9a86a22003116314f16b8187e04e'
}

const meshPointEvents = [
    {
        Id: 1,
        Type: 'MESHPOINT_CREATED',
        PropertyCount: 4,

        Name: 'Car2Go',
        LocationPointer: 'firebase/location/pointer/1',
        IntegrityHash: '0x7070d0c4c178fddDc374A2e64be81BCa88fAd689',
        MaxConnections: 10,
        CreatorAddress: '0xfdbc580c38279a55cd3b058ca68aedaa2a2e848e'
    },
    {
        Id: 2,
        Type: 'MESHPOINT_PEER_JOINED',
        PropertyCount: 4,

        Name: 'Alice',
        LocationPointer: 'firebase/location/pointer/3',
        IntegrityHash: '0x7070d0c4c178fddDc374A2e64be81BCa88fAd689',
        CreatorAddress: '0x69c2617390a0003b2cea5368bc11705a20534967'
    }
]

module.exports = {
    meshPointEvent,
    meshPointEvents
}
