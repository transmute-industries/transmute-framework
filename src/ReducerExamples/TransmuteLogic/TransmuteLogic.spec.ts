// import { expect } from 'chai'

// const jsonLogic = require('json-logic-js')

// // Remember {"log":"apple"} for debugging

// const {extend}  = require('lodash')
// const moment = require('moment')

// import {
//     JSON_FEED,
//     JSON_LD,
//     JSON_SCHEMA,
//     JSON_LOGIC
// } from '../Mock/data'

// // console.log(data)s
// // console.log(result)

// import { TransmuteLogic } from './TransmuteLogic'

// describe("TransmuteLogic", () => {
//     describe(".apply", () => {
//         it("returns the result of jsonLogic.apply", () => {
//             let rule = JSON_LOGIC.isPieReadyToEat
//             let data = JSON_FEED.Pie[0]
//             let result1 = jsonLogic.apply(rule, data)
//             let result2 = TransmuteLogic.apply(rule, data)
//             expect(result1 === false)
//             expect(result2 === false)
//         })

//         it(" can be used to tell if invoice is past due", () => {
//             let rule = JSON_LOGIC.isInvoicePastDue
//             let data = JSON_LD.Invoice
//             let now = moment().format('YYYY-MM-DD')
//             extend( data, {
//                 "now": now
//             })
//             // console.log(data.paymentDueDate,  now)
//             // console.log(data.paymentDueDate < now)
//             let result = TransmuteLogic.apply(rule, data)
//             // console.log('result: ', result)
//             expect(result === true)
//         })
//     })

//     describe(".projection", () => {
//         it(" can tell when a pie is ready to eat", () => {
//             let rule = JSON_LOGIC.isPieReadyToEat
//             let data = JSON_FEED.Pie
//             let result = TransmuteLogic.projection(rule, data)
//             expect(result[0] === false)
//             expect(result[1] === false)
//         })
//     })

// })
