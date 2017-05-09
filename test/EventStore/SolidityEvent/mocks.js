const meshPointEvent = {
    Id: 0,
    Type: 'MESHPOINT_CREATED',
    PropertyCount: 4,

    Name: 'Coral',
    LocationPointer: 'firebase/location/pointer/0',
    IntegrityHash: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689',
    MaxConnections: 15,
    CreatorAddress: '0x6046d0c4c178fddDc374A2e64be81BCa88fAd689'
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
        CreatorAddress: '0x4242d0c4c178fddDc374A2e64be81BCa88fAd689'
    },
    {
        Id: 2,
        Type: 'MESHPOINT_PEER_JOINED',
        PropertyCount: 4,

        Name: 'Alice',
        LocationPointer: 'firebase/location/pointer/3',
        IntegrityHash: '0x7070d0c4c178fddDc374A2e64be81BCa88fAd689',
        CreatorAddress: '0x4242d0c4c178fddDc374A2e64be81BCa88fAd689'
    }
]

module.exports = {
    meshPointEvent,
    meshPointEvents
}