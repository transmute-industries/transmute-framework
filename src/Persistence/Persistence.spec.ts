"use strict";

import { expect } from 'chai'
import { Persistence } from "./Persistence";

describe("Persistence", () => {
    it("is an object", () => {
        expect(typeof Persistence === "object");
    })
    describe("getItem", () => {
        it("is an function", () => {
            expect(typeof Persistence.getItem === "function");
        })
    })
    describe("setItem", () => {
        it("is an function", () => {
            expect(typeof Persistence.setItem === "function");
        })
    })
});
