"use strict";
const moment = require('moment')
const firebase = require('firebase')

import { expect } from 'chai'

import {
  JSON_SCHEMA,
} from '../EventStore/Mock/data'

import {ReadModel} from './ReadModel'

describe("ReadModel", () => {

    let flatFaucet: any
    describe("flatten", () => {
        it("should return the flattened object, ready to be an event", () => {
            flatFaucet = ReadModel.flatten(JSON_SCHEMA.Person)
            expect(flatFaucet.title == JSON_SCHEMA.Person.title)
            expect(flatFaucet['properties.age.description'] == JSON_SCHEMA.Person.properties.age.description)
        })
    })

    describe("unflatten", () => {
        it("should return the flattened object, ready to be an event", () => {
            let unflatFaucet: any = ReadModel.unflatten(flatFaucet)
            expect(unflatFaucet.title == JSON_SCHEMA.Person.title)
            expect(unflatFaucet.properties.age.description == JSON_SCHEMA.Person.properties.age.description)
        })
    })

});
