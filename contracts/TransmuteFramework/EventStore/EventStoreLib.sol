pragma solidity ^0.4.11;
import '../zeppelin/lifecycle/Killable.sol';

library EventStoreLib{

    struct EsEventStruct {
        address TxOrigin;
        uint Created;
        bytes32 Meta; // Event Type + Version
        bytes1 Type; // A - Address, U - UInt, B - Bytes32
        bytes32 Data; // Data 
    }

    struct EsEventStorage {
        EsEventStruct[] events;
    }

    // WRITE EVENT
    function writeEvent(
        EsEventStorage storage self, 
        bytes32 _meta,
        bytes1 _type,
        bytes32 _data
    ) returns (uint) {
        uint _created = now;
        uint _eventId = self.events.length;

        EsEventStruct memory esEvent;
        esEvent.TxOrigin = tx.origin;
        esEvent.Created = _created;
        esEvent.Meta = _meta;
        esEvent.Type = _type;
        esEvent.Data = _data;

        EsEvent(
            _eventId,
            esEvent.TxOrigin, 
            esEvent.Created,
            esEvent.Meta,
            esEvent.Type,
            esEvent.Data
        );
        self.events.push(esEvent);
        return _eventId;
    }

    // READ EVENT
    function readEvent(EsEventStorage storage self, uint _eventId) 
    returns (uint, address, uint, bytes32, bytes1, bytes32) {
        EsEventStruct memory esEvent = self.events[_eventId];
        return (
            _eventId, 
            esEvent.TxOrigin, 
            esEvent.Created,
            esEvent.Meta,
            esEvent.Type,
            esEvent.Data
        );
    }

    event EsEvent(
        uint Id,
        address TxOrigin,
        uint Created,
        bytes32 Meta,
        bytes1 Type,
        bytes32 Data
    );

}