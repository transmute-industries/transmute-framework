import { expect } from 'chai'

const jsonLogic = require('json-logic-js')

// Remember {"log":"apple"} for debugging
const RULES = {
    // The pie isn’t ready to eat unless it’s cooler than 110 degrees, and filled with apples.
    isPieReadyToEat: require('../EventStore/Mock/JSON_LOGIC/isPieReadyToEat.json'),
    // The invoice is past due if now is after paymentDueDate
    // isInvoicePastDue:  require('../EventStore/Mock/JSON_LOGIC/isInvoicePastDue.json'),
}

const STATE_STREAM = {
    pie: require('../EventStore/Mock/JSON_FEED/pie.json'),
}

// console.log(data)
// console.log(result)

import { TransmuteLogic } from './TransmuteLogic'

describe("TransmuteLogic", () => {
    describe(".apply", () => {
        it("returns the result of jsonLogic.apply", () => {
            let rule = RULES.isPieReadyToEat
            let data = STATE_STREAM.pie[0]
            let result1 = jsonLogic.apply(rule, data)
            let result2 = TransmuteLogic.apply(rule, data)
            expect(result1 === false)
            expect(result2 === false)
        })
    })

    describe(".projection", () => {
        it("maps each object to jsonLogic.apply of rule", () => {
            let rule = RULES.isPieReadyToEat
            let data = STATE_STREAM.pie
            let result = TransmuteLogic.projection(rule, data)
            expect(result[0] === false)
            expect(result[1] === false)
        })
    })

})
