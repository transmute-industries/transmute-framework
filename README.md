# Transmute Framework

An ethereum smart contract framework.

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
- https://github.com/transmute-industries/eth-faucet


Example git project that is used for typescript libraries as a starter pack

What does it include:
----
    1. exported class as example for an npm moudle
    2. packaging for npm modules (webpack + tslint + awesome-typescript-loader + dts-bundle)
    3. testings for npm modules (jest)
    4. code coverage (jest) when running tests
    5. Typescript => ES6 => ES5 (babel)
    6. Two versions embed in the package, one for node, one for browser (browserify)

Notes
----
Please note that you will need to rename the library name in some files:

    1. webpack.config.js (bundle_opts)
    2. package.json (ofcourse ;))
Also don't forget to reset package version ;)

Useful commands:
----
    npm run prebuild       - install NPM dependancies
    npm run build          - build the library files
    npm run test           - run the tests
    npm run test:watch     - run the tests (watch-mode)
    npm run coverage       - run the tests with coverage
    npm run coverage:watch - run the tests with coverage (watch-mode)
    npm run pack           - build the library, make sure the tests passes, and then pack the library (creates .tgz)
    npm run release        - prepare package for next release

Files explained:
----
    1. src - directory is used for typescript code that is part of the project
        1a. src/Example.ts - Just an example exported library, used to should import in tests.
        1b. src/Example.spec.ts - tests for the example class
        1c. src/index.ts        - index, which functionality is exported from the library
        1d. src/main.ts         - just wrapper for index
    3. package.json                 - file is used to describe the library
    4. tsconfig.json                - configuration file for the library compilation
    6. tslint.json                  - configuration file for the linter (both test and library)
    8. webpack.config.js            - configuration file of the compilation automation process for the library

Output files explained:
----
    1. node_modules                       - directory npm creates with all the dependencies of the module (result of npm install)
    2. dist                               - directory contains the compiled library (javascript + typings)
    3. <module_name>-<module_version>.tgz - final tgz file for publish. (result of npm run pack)
    4. coverage                           - code coverage report output made by istanbul
