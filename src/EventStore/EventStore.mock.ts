export const unMarshalledExpectedEvents = [
    {
        id: 0,
        txOrigin: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0',
        created: 0, // we don't know this yet...
        eventType: 'MUTEX_LOCK',
        keyType: 'X',
        valueType: 'A',
        key: 'address',
        value: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0'
    },
    {
        id: 1,
        txOrigin: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0',
        created: 0,
        eventType: 'MUTEX_LOCK',
        keyType: 'X',
        valueType: 'U',
        key: 'code',
        value: 1337
    },
    {
        id: 2,
        txOrigin: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0',
        created: 0,
        eventType: 'MUTEX_LOCK',
        keyType: 'X',
        valueType: 'B',
        key: 'bytes32',
        value: '0x0000000000000000000000000000000000000000000000000000000000000003'
    },
    {
        id: 3,
        txOrigin: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0',
        created: 0,
        eventType: 'MUTEX_LOCK',
        keyType: 'X',
        valueType: 'X',
        key: 'welcomeMessage',
        value: 'Hello world'
    },
    {
        id: 3,
        txOrigin: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0',
        created: 0,
        eventType: 'MUTEX_LOCK',
        keyType: 'X',
        valueType: 'I',
        key: 'multihash',
        value: 'QmRrehjkb86JvJcNJwdRBmnBL7a6Etkaooc98hvrXSCpn7'
    }
]

export const fsaCommands = [
    {
        type: 'ADDRESS_KEY_VALUE',
        payload: {
            address: '0x1a63f28550ae27e0a192d91d073ea4e97dd089b0'
        },
    },
    {
        type: 'UINT_KEY_VALUE',
        payload: {
            code: 1337
        },
    },
    {
        type: 'BYTES32_KEY_VALUE',
        payload: {
            bytes32: '0x0000000000000000000000000000000000000000000000000000000000000003'
        }
    },
    {
        type: 'IPLD_KEY_VALUE',
        payload: {
            multihash: 'QmRrehjkb86JvJcNJwdRBmnBL7a6Etkaooc98hvrXSCpn7'
        }
    },
    {
        type: 'IPLD_OBJECT',
        payload: {
            name: 'hodor',
            class: 'ogre',
            inventory: ['axe']
        }
    },
]