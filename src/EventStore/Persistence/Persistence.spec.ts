"use strict";
const moment = require('moment')
const firebase = require('firebase')

import { expect } from 'chai'
import { Persistence } from "./Persistence";

import { firebaseConfig } from '../../config'

describe("Persistence", () => {

    let key = 'a-valid-key'
    let value = {
        name: 'a valid value'
    }

    before(()=>{
        //  let db = Persistence.FireStore.init()
    })
    
    describe(".setItem", () => {

        it("should return a promise for the value", () => {
            return Persistence.setItem(key, value)
                .then((dataReadFromCache: any) => {
                    expect(dataReadFromCache.name == value.name)
                })
        })
    
        it("has default expiration of 15 seconds", (done) => {
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

    //     it("supports custom expiration in 5 seconds", (done) => {
    //         let expires = moment().add(5, 'seconds').toISOString()
    //         Persistence.setItem(key, value, expires)
    //             .then((dataReadFromCache: any) => {
    //                 expect(dataReadFromCache !== null)
    //                 expect(dataReadFromCache.name == value.name)
    //             })
    //         setTimeout(() => {
    //             Persistence.getItem(key)
    //                 .then((dataReadFromCache: any) => {
    //                     expect(dataReadFromCache !== null)
    //                     expect(dataReadFromCache.name == value.name)
    //                 })
    //         }, 3 * 1000)
    //         setTimeout(() => {
    //             Persistence.getItem(key)
    //                 .then((dataReadFromCache: any) => {
    //                     expect(dataReadFromCache === null)
    //                     done()
    //                 })
    //         }, 6 * 1000)
    //     })

    //     it("supports custom firebase store", () => {
    //         let expires = moment().add(5, 'seconds').toISOString()
    //         return Persistence.setItem(key, value, expires, Persistence.FireStore)
    //             .then((dataReadFromCache: any) => {
    //                 expect(dataReadFromCache !== null)
    //                 expect(dataReadFromCache.name == value.name)
    //             })
    //     })

    })


    describe(".getItem", () => {
        before( () =>{
            let expires = moment().add(5, 'seconds').toISOString()
            Persistence.setItem(key, value, expires)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
            // Persistence.setItem(key, value, expires, Persistence.FireStore)
            // .then((dataReadFromCache: any) => {
            //     expect(dataReadFromCache !== null)
            //     expect(dataReadFromCache.name == value.name)
            // })
        })
        it("should return a promise for the value", () => {
            return Persistence.getItem(key)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
        })

        // it("supports custom firebase store", () => {
        //     return Persistence.getItem(key, Persistence.FireStore)
        //         .then((dataReadFromCache: any) => {
        //             expect(dataReadFromCache !== null)
        //             expect(dataReadFromCache.name == value.name)
        //         })
        // })
    })

      describe(".expireItem", () => {
        before( () =>{
            let expires = moment().add(10, 'seconds').toISOString()
            Persistence.setItem(key, value, expires)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache !== null)
                expect(dataReadFromCache.name == value.name)
            })
        })

         it("should return a promise for null for expired item", () => {
            Persistence.expireItem(key)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache === {})
            })
            Persistence.getItem(key,)
            .then((dataReadFromCache: any) => {
                expect(dataReadFromCache === null)
            })
        })

    })

    // after(()=>{
    //     firebase.app('[DEFAULT]').delete();
    // })
    
})
