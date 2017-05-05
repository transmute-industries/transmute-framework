'use strict'

import { assert } from 'chai'
import TF from './TF'

describe('TF', () => {

  before(() => {
    // console.log(TF)
  })

  describe('.config', () => {
    it('has firebase config', () => {
      assert.isObject(TF.config.firebase)
    })
  })

})

