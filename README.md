# Transmute Framework

An ethereum smart contract framework.

[![Build Status](https://travis-ci.org/transmute-industries/transmute-framework.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute-framework)

EventStore provides a simple javascript event based interface to the ethereum blockchain.
Smart contract developers can annotate their contracts with "is EventStore" and instantly 
unlock awesome state mangement capabilities powered by redux.

ReadModels represent views of the state of your smart contract. For example, a PLC for a 
nuclear facility might have an event stream containg firmware updates, commands, readings, etc...
These events are reduced into a model which represents state of the controller over time.
As actions are taken, events are processed and the state of the controller updates.

Persistence provides a caching (and later encryption) layer for storing read models off the chain.
Reading from the chain is expensive, and unnecessary, because all that is needed to maintain state 
is the read model and any new events.

By storing our read models in a realtime database, such as firebase, we provide a realtime view of
smart contract state.

Transactions are the result of calling truffle contracts. Events are received in transactions, and
applied to read models by a model reducer.

### Usage 

```
npm install 
```

### PM2

A process manager command line tool.

```
$ npm run testrpc
$ pm2 logs testrpc
$ pm2 kill
```

### Truffle

```
$ truffle test
```

### Tests

```
$ npm run test:all
```


### Contributing 

Please fork and submit PRs. There are integration tests for truffle and javascript libraries that run in travis.
If these fail, expect your PR to be rejected ; )

### References

- https://github.com/Upchain/truffle-template
- https://github.com/OR13/FireDocs
- https://github.com/transmute-industries/eth-faucet

