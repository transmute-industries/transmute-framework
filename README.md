# Transmute Framework

An ethereum smart contract framework.

```
$ npm install transmute-framework@latest --save
```

[![NPM version](https://img.shields.io/npm/v/transmute-framework.svg)](https://www.npmjs.com/package/transmute-framework)
[![Build Status](https://travis-ci.org/transmute-industries/transmute-framework.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute-framework)
[![Coverage Status](https://coveralls.io/repos/transmute-industries/transmute-framework/badge.svg?branch=master&service=github)](https://coveralls.io/github/transmute-industries/transmute-framework?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

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

### Commands
```
npm install            - install the package and its dependencies
npm run clean          - clean the project of all build and debug data
npm run testrpc        - run testrpc
pm2 logs testrpc       - review testrpc logs
truffle migrate        - migrate truffle contracts
truffle test           - test truffle contracts
npm run test           - run framework middleware tests
npm run build          - build the library
npm run docs           - build the docs
npm run patch          - increment the package version and create a tag
npm publish            - deploy the package to npm
npm run deploy:docs    - deploy the docs to https://framework.transmute.industries
pm2 kill               - kill testrpc and any other pm2 processes
```

### Contributing 

Please fork and submit PRs. There are integration tests for truffle and javascript libraries that run in travis.
If these fail, expect your PR to be rejected ; )

### References

- https://github.com/Upchain/truffle-template
- https://github.com/transmute-industries/eth-faucet

