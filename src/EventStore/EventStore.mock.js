import { web3 } from '../env'

export const event = {
    Id: 0,
    Type: 'PROJECT_CREATED',
    AddressValue: web3.eth.accounts[0],
    UIntValue: 1,
    StringValue: 'Coral'
}

export const eventStream = [
    {
        Id: 1,
        Type: 'PROJECT_JOINED',
        AddressValue: web3.eth.accounts[0],
        UIntValue: 1,
        StringValue: 'Engineer Alice'
    },
    {
        Id: 2,
        Type: 'PROJECT_JOINED',
        AddressValue: web3.eth.accounts[1],
        UIntValue: 1,
        StringValue: 'Customer Bob'
    },
    {
        Id: 3,
        Type: 'PROJECT_MILESTONE',
        AddressValue: web3.eth.accounts[0],
        UIntValue: 1,
        StringValue: 'Version 0'
    }
]

export const initialProjectState = {
    Id: '0',
    EventCount: null,
    Name: '',
    Users: [],
    Milestones: []
}

export const expectedProjectState = {
    Id: '0',
    Name: 'Coral',
    Users: ['Engineer Alice', 'Customer Bob'],
    Milestones: ['Version 0']
}

export const projectReducer = (state = initialProjectState, event) => {
    if (event.Type === 'PROJECT_CREATED') {
        state = Object.assign({}, state, {
            Name: event.StringValue
        })
    }
    if (event.Type === 'PROJECT_JOINED') {
        state = Object.assign({}, state, {
            Users: state.Users.concat(event.StringValue)
        })
    }
    if (event.Type === 'PROJECT_MILESTONE') {
        state = Object.assign({}, state, {
            Milestones: state.Milestones.concat(event.StringValue)
        })
    }
    // Important for synching state
    state.EventCount = event.Id
    return state
}

export default {
    event,
    eventStream,

    initialProjectState,
    expectedProjectState,
    projectReducer
}
