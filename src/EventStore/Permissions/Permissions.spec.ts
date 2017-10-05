// 'use strict'

import TransmuteFramework from '../../transmute-framework'

const { web3, AccessControlContract, Permissions } = TransmuteFramework.init()

import { assert, expect, should } from 'chai'

describe('Permissions', () => {
  let acc

  let factory, account_addresses, account, fromAddress
  jest.setTimeout(16 * 1000)
  beforeAll(async () => {
    account_addresses = await TransmuteFramework.getAccounts()
    account = account_addresses[0]
    fromAddress = account
    acc = await AccessControlContract.deployed()
  })

  describe('.setAddressRole', () => {
    it('owner can make account 1 an admin', async () => {
      let { tx, events } = await Permissions.setAddressRole(acc, fromAddress, account_addresses[1], 'admin')
      assert.equal(events[0].type, 'AC_ROLE_ASSIGNED', 'expect AC_ROLE_ASSIGNED event')
      assert.equal(events[0].payload[account_addresses[1]], 'admin', 'expect account1 to be assigned admin')
      // TODO: add more tests here...
    })
  })

  describe('.setGrant', () => {
    it('owner can grant admin role create:any eventstore', async () => {
      let txWithEvents = await Permissions.setGrant(acc, fromAddress, 'admin', 'eventstore', 'create:any', ['*'])
      // console.log(events)
      assert.equal(txWithEvents.events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')

      txWithEvents = await Permissions.setGrant(acc, fromAddress, 'admin', 'eventstore', 'delete:any', ['*'])
      // console.log(events)
      assert.equal(txWithEvents.events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')
      // TODO: add more tests here...
    })

    it('owner can grant admin role create:any castle', async () => {
      let { tx, events } = await Permissions.setGrant(acc, fromAddress, 'admin', 'castle', 'create:any', ['*'])
      // console.log(events)
      assert.equal(events[0].type, 'AC_GRANT_WRITTEN', 'expect AC_GRANT_WRITTEN event')
      // TODO: add more tests here...

      let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, fromAddress)

      // console.log(readModel)
    })
  })

  describe('.getGrant', () => {
    it('anyone can get a grant', async () => {
      let grant = await Permissions.getGrant(acc, fromAddress, 0)
      // console.log(grant)
      // TODO: add more tests here...
    })
  })

  describe('.canRoleActionResource', () => {
    it('owner can check if role is granted action on resource', async () => {
      let granted = await Permissions.canRoleActionResource(acc, fromAddress, 'admin', 'create:any', 'eventstore')
      // console.log(granted)
      assert(granted, 'expect admin can create any event store')
      // TODO: add more tests here...
    })
  })

  describe('.getPermissionsReadModel', () => {
    it('return grants as object', async () => {
      let readModel = await TransmuteFramework.Permissions.getPermissionsReadModel(acc, fromAddress)
      // console.log(readModel.model)
      // Todo: add tests here...
    })
  })
})
