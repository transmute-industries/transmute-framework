"use strict"
const moment = require("moment")

import { expect } from "chai"
import { Persistence } from "../Persistence"

describe("Persistence.LocalStore", () => {
  let key = "a-valid-key"
  let value = {
    name: "a valid value"
  }

  describe(".setItem", () => {
    it("returns a promise for the value in local storage", () => {
      return Persistence.LocalStore
        .setItem(key, value)
        .then((dataReadFromCache: any) => {
          expect(dataReadFromCache.name == value.name)
        })
    })
  })
  describe(".getItem", () => {
    it("returns a promise for the value in local storage", () => {
      return Persistence.LocalStore
        .getItem(key)
        .then((dataReadFromCache: any) => {
          expect(dataReadFromCache.name == value.name)
        })
    })
  })
})
