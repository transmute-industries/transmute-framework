"use strict";
const moment = require('moment')
const firebase = require('firebase')

import { expect } from 'chai'
import { Persistence } from "../Persistence";


let key = 'a-valid-key'
let value = {
    name: 'a valid value'
}

import { firebaseConfig } from '../../config'

describe("Persistence.FireStore", () => {

    describe(".init", () => {
        it("should use transmute-framework firebase by default", () => {
            let db = Persistence.FireStore.init()
            firebase.app('[DEFAULT]').delete();
        })

        it("supports a custom firebase config", () => {
            let db = Persistence.FireStore.init(firebaseConfig)
        })
    })
    describe(".setItem", () => {
        it("returns a promise for the value in local storage", () => {
            return Persistence.FireStore.setItem(key, value)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache.name == value.name)
                })
        })
    })
    describe(".getItem", () => {
        it("returns a promise for the value in local storage", () => {
            return Persistence.FireStore.getItem(key)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache.name == value.name)
                })
        })
    })

    after(()=>{
        firebase.app('[DEFAULT]').delete();
    })
})


