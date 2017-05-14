"use strict";
const moment = require('moment')

import { expect } from 'chai'
import { Persistence } from "./Persistence";

describe("Persistence", () => {

    let key = 'a-valid-key'
    let value = {
        name: 'a valid value'
    }

    describe("LocalStore", () => {
        describe(".setItem", () => {
            it("returns a promise for the value in local storage", () => {
                    return Persistence.LocalStore.setItem(key, value)
                        .then((dataReadFromCache: any) => {
                            expect(dataReadFromCache.name == value.name)
                        })
            })
        })
        describe(".getItem", () => {
            it("returns a promise for the value in local storage", () => {
                    return Persistence.LocalStore.getItem(key)
                        .then((dataReadFromCache: any) => {
                            expect(dataReadFromCache.name == value.name)
                        })
            })
        })
    })

    describe("FireStore", () => {
        before(() =>{
            Persistence.FireStore.init()
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
    })

    it("Cache.setItem returns a promise for the value", () => {
        return Persistence.setItem(key, value)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache.name == value.name)
            })
    })
    it("Cache.getItem returns a promise for the value", () => {
        return Persistence.getItem(key)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
    })
    it("Cache.setItem has default expiration of 15 seconds", (done) => {
        Persistence.setItem(key, value)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache.name == value.name)
                return Persistence.getItem(key)
            })
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
        setTimeout(() => {
            Persistence.getItem(key)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache !== null)
                    expect(dataReadFromCache.name == value.name)
                })
        }, 3 * 1000)
        setTimeout(() => {
            Persistence.getItem(key)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache === null)
                    done()
                })
        }, 15 * 1000)
    })

    it("Cache.setItem supports custom expiration in 5 seconds", (done) => {
        let expires = moment().add(5, 'seconds').toISOString()
        Persistence.setItem(key, value, expires)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
        setTimeout(() => {
            Persistence.getItem(key)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache !== null)
                    expect(dataReadFromCache.name == value.name)
                })
        }, 3 * 1000)
        setTimeout(() => {
            Persistence.getItem(key)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache === null)
                    done()
                })
        }, 6 * 1000)
    })

    // it("Cache.setItem supports custom store", () => {
    //     let key = 'a-valid-key'
    //     let value = {
    //         name: 'a valid value'
    //     }
    //     let expires = moment().add(5, 'seconds').toISOString()
    //     let firebaseStore = null
    //     return Persistence.setItem(key, value, expires, firebaseStore)
    //         .then((dataReadFromCache: any) => {
    //             expect(dataReadFromCache !== null)
    //             expect(dataReadFromCache.name == value.name)
    //         })
    // })


});
