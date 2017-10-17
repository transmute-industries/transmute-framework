# Transmute Framework

TypeScript dApp Framework

Very alpha, expect breaking changes...

Requires node: v8.6.0


```
$ npm install transmute-framework@latest --save
$ yarn add transmute-framework@latest
```

[![NPM version](https://img.shields.io/npm/v/transmute-framework.svg)](https://www.npmjs.com/package/transmute-framework)
[![Build Status](https://travis-ci.org/transmute-industries/transmute-framework.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute-framework)
[![Coverage Status](https://coveralls.io/repos/github/transmute-industries/transmute-framework/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/transmute-framework?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

### Usage
```
yarn install           - install the package and its dependencies
yarn cleanup           - clean the project of all build and debug data
yarn testrpc:start     - start testrpc
yarn testrpc:stop      - stop testrpc
yarn truffle:migrate   - migrate truffle contracts
yarn truffle:test      - run truffle tests
yarn test              - test framework with jest (not truffle tests)
yarn build             - build the library
yarn docs              - build the docs
yarn docs:deploy       - deploy the docs
npm version patch      - increment the package version and create a tag
npm publish            - deploy the package to npm
pm2 kill               - kill testrpc and any other pm2 processes
```

### Contributing

Please fork and submit PRs. There are integration tests for truffle and javascript libraries that run in travis.

### References

- https://github.com/Upchain/truffle-template
- https://github.com/transmute-industries/eth-faucet
- https://github.com/AugurProject/augur/blob/master/src/modules/auth/actions/register.js
- https://airbitz.co/developer-api-library/
- https://github.com/Hotell/typescript-lib-starter



