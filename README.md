# Transmute Framework

An ethereum + ipfs dApp framework.

```
$ npm install transmute-framework@latest --save
```

[![NPM version](https://img.shields.io/npm/v/transmute-framework.svg)](https://www.npmjs.com/package/transmute-framework)
[![Build Status](https://travis-ci.org/transmute-industries/transmute-framework.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute-framework)
[![Coverage Status](https://coveralls.io/repos/github/transmute-industries/transmute-framework/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/transmute-framework?branch=master)
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

The end result is a familiar action, reducer, redux interface for your smart contracts, letting you focus on the business logic and security, and not on state management or data transfer objects.

### Usage
```
npm install            - install the package and its dependencies
npm run clean          - clean the project of all build and debug data
npm run testrpc        - run testrpc
pm2 logs testrpc       - review testrpc logs
npm run transmute      - transmute cli
truffle migrate        - migrate truffle contracts
truffle test           - test framework truffle contracts
npm run test           - test framework module (web and nodejs)
npm run test:cli       - test framework nodejs cli
npm run build          - build the library
npm run docs           - build the docs
npm run docs:deploy    - deploy the docs to 
npm run patch          - increment the package version and create a tag
npm publish            - deploy the package to npm
pm2 kill               - kill testrpc and any other pm2 processes
```


### Events + Commands

We apologize for the terminology, there is a lot of room for improvement, feel free to open an issue to make a suggestion.

You write a command, you read an event.

The semantix of commands and events is WIP, probably not correct w.r.t. CQRS, and something we want help fixing.

#### Events

Events have happened, they are an object that represents a state transition. If you are reading an event, then that transition has already happened. You can see when it happened, who made it happen, what details were important to describe what happened, etc.

###### type

Events have a `type` that is past tense, 'SESSION_STARTED', 'INVOICE_PAID', 'USER_SUBSCRIBED'.

A point of confustion in our framework is that often times, we are saving an event that has already happened, so the commands often represent the intention _save this event which already happened_ and thus share the same type as the event, namely a past tense string and not a present tense directive, such as 'START_USER_SESSION'.

###### payload
Events have a `payload` that represents what changed, or new information about a domain.
Our framework supports 3 kinds of payloads: `uint`, `address`, `string`. In addition, `object` payloads are mapped to IPLD and dehydrated and rehydrated from IPFS, but their format on the block chain is their hash as a string.


#### Commands

For now, commands look like events, but have different meta data which indicated persistence extensions.
A typical command from a transmute client will be to save an event which has happened.

## IPLD 

What is IPLD? - https://ipld.io/

### How does the framework use IPLD?

We use IPLD for object payloads. This means that by default any object payload will be converted to IPLD and persisted.
This data conversion is transparent to the user.

### Contributing 

Please fork and submit PRs. There are integration tests for truffle and javascript libraries that run in travis.
If these fail, expect your PR to be rejected ; )

### References

- https://github.com/Upchain/truffle-template
- https://github.com/transmute-industries/eth-faucet
- https://github.com/AugurProject/augur/blob/master/src/modules/auth/actions/register.js
- https://airbitz.co/developer-api-library/




