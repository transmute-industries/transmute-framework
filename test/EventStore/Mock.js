let Events = {
    testUnauthorizedAddressValueEvent: {
        Type: 'TEST_EVENT',
        Version: 'v0',
        ValueType: 'Address',
        IsAuthorizedEvent: false,
        PermissionDomain: 'ES',
        AddressValue: web3.eth.accounts[1],
        UIntValue: 0,
        Bytes32Value: '',
        StringValue: ''
    },
    testAuthorizedAddressValueEvent: {
        Type: 'TEST_AUTH_EVENT',
        Version: 'v0',
        ValueType: 'Address',
        IsAuthorizedEvent: true,
        PermissionDomain: 'ES',
        AddressValue: web3.eth.accounts[1],
        UIntValue: 0,
        Bytes32Value: '',
        StringValue: ''
    }
}

module.exports = {
    Events
}
