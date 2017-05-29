"use strict";
import * as moment from 'moment'
import * as _ from 'lodash'

import { expect, assert, should } from 'chai'

import { ReadModel } from './ReadModel'
import events from '../Mock/Demo/Healthcare/events'
import { reducer, readModel } from '../Mock/Demo/Healthcare/reducer'

var fs = require('fs');

const writeReadModelToFile = (readModel) => {
    fs.writeFile('./temp/' + readModel.readModelType + ".ReadModel.json", JSON.stringify(readModel), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

describe("ReadModel", () => {

    describe("readModelGenerator", () => {
        it("should return the initial read model when passed an empty array", () => {
            // This will usually be overidden by the consumer
            readModel.contractAddress = '0x0000000000000000000000000000000000000000'
            let updatedReadModel = ReadModel.readModelGenerator(readModel, reducer, [])
            assert(_.isEqual(readModel, updatedReadModel), 'expected no changes from application of empty event array')
        })

        it("should return an updated read model when passed a non-empty event array", () => {
            let registerEvent = <any>events[0]
            let updatedReadModel = ReadModel.readModelGenerator(readModel, reducer, [registerEvent])
            assert.equal(updatedReadModel.lastEvent, 0, 'expected event 0 to have been applied to the read model')
            assert.equal(
                updatedReadModel.model.patient[registerEvent.payload.patientId].patientName,
                registerEvent.payload.patientName,
                'expected patient to be registered'
            )
        })

        it("should handle multiple events fine", () => {
            let updatedReadModel = ReadModel.readModelGenerator(readModel, reducer, events)
            // add some tests here maybe... but really just look at the file in temp
            // writeReadModelToFile(updatedReadModel)
        })
    })

    // Needs work
    describe("maybeSyncReadModel", () => {
        it("should return the same read model if it is up to date", () => {
            // This will usually be overidden by the consumer
            // readModel.contractAddress = '0x0000000000000000000000000000000000000000'
            // let updatedReadModel = ReadModel.readModelGenerator(readModel, reducer, [])
            // assert(_.isEqual(readModel, updatedReadModel), 'expected no changes from application of empty event array')
        })
    })

});
