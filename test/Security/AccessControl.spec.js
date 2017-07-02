
const Web3 = require('web3')

const AccessControlContract = artifacts.require('./TransmuteFramework/Security/AccessControl.sol')

var AccessControl = require('accesscontrol');

const {
    grantItemFromEvent,
    grantItemFromValues,
    permissionFromCanRoleActionResourceValues
} = require('../Common')

const fs = require('fs')

const _ = require('lodash')

describe.only('', () => {

    let ac, tac

    let relaxedPermsAreEqual = (p1, p2) => {
        return _.every([
            p1.granted == p2.granted,
            p1._.role == p2._.role,
            p1._.resource == p2._.resource,
            p1.resource == p2.resource,
            _.isEqual(p1.attributes, p2.attributes),
        ])
    }

    contract('AccessControl', (accounts) => {

        before(async () => {
            ac = new AccessControl()
            tac = await AccessControlContract.deployed()
        })

        describe('canRoleActionResource(role, action, resource) congruity to can(role).action(resource)', () => {

            it('for defined permissions', async () => {
                // We start by granting an admin create:any for event store
                let grantAdminCreateAnyEventStore = { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: ['*'] }
                let grantRevokeAdminCreateAnyEventStore = { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: [] }
                ac.setGrants([grantAdminCreateAnyEventStore])
                // A defined permission in Node
                let acAdminCreateAnyEventStorePerm = ac.can('admin').createAny('eventstore')
                assert(acAdminCreateAnyEventStorePerm.granted, "expect admin can create any eventstore")
                // Now we do the same in Ethereum
                let tx = await tac.setGrant('admin', 'eventstore', 'create:any', ['*'])
                let item = grantItemFromEvent(tx.logs[0].args)
                let grantValues = await tac.getGrant.call(0)
                let item2 = grantItemFromValues(grantValues)
                // A defined permission in Ethereum
                let permissionValues = await tac.canRoleActionResource.call('admin', 'create:any', 'eventstore')
                let tacAdminCreateAnyEventStorePerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(
                    relaxedPermsAreEqual(acAdminCreateAnyEventStorePerm, tacAdminCreateAnyEventStorePerm),
                    'expect ac & tac to agree that admins can create any eventstore'
                );
            })

            it('for undefined permissions', async () => {
                // An undefined permission in Node
                let acAdminDeleteAnyEventStorePerm = ac.can('admin').deleteAny('eventstore')
                assert(!acAdminDeleteAnyEventStorePerm.granted, "expect admin can not delete any eventstore")
                // An udefined permission in Ethereum
                let permissionValues = await tac.canRoleActionResource.call('admin', 'delete:any', 'eventstore')
                let tacAdminDeleteAnyEventStorePerm = permissionFromCanRoleActionResourceValues(permissionValues)
                assert(
                    relaxedPermsAreEqual(acAdminDeleteAnyEventStorePerm, tacAdminDeleteAnyEventStorePerm),
                    'expect ac & tac to agree that admins can not delete any eventstore'
                );
            })
        })


        // it('ac.setGrants => tac.setGrant + tac.getGrant', async () => {

        //     // We start by granting an admin create:any for event store
        //     let grantAdminCreateAnyEventStore = { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: ['*'] }
        //     let grantRevokeAdminCreateAnyEventStore = { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: [] }
        //     ac.setGrants([grantAdminCreateAnyEventStore])

        //     // A defined permission in Node
        //     let acAdminCreateAnyEventStorePerm = ac.can('admin').createAny('eventstore')
        //     assert(acAdminCreateAnyEventStorePerm.granted, "expect admin can create any eventstore")

        //     // An undefined permission in Node
        //     let acAdminDeleteAnyEventStorePerm = ac.can('admin').deleteAny('eventstore')
        //     assert(!acAdminDeleteAnyEventStorePerm.granted, "expect admin can not delete any eventstore")

        //     // Now we do the same in Ethereum

        //     let tx = await tac.setGrant('admin', 'eventstore', 'create:any', ['*'])
        //     let item = grantItemFromEvent(tx.logs[0].args)

        //     let grantValues = await tac.getGrant.call(0)
        //     let item2 = grantItemFromValues(grantValues)

        //     // A defined permission in Ethereum
        //     let permissionValues = await tac.canRoleActionResource.call('admin', 'create:any', 'eventstore')
        //     let tacAdminCreateAnyEventStorePerm = permissionFromCanRoleActionResourceValues(permissionValues)

        //     assert(
        //         relaxedPermsAreEqual(acAdminCreateAnyEventStorePerm, tacAdminCreateAnyEventStorePerm),
        //         'expect ac & tac to agree that admins can create any event store'
        //     );

        //     // Here we expect grant == item == item2
        //     // If true, we have should the Tx Event and Struct are equivalent to the grant
        //     // assert(_.isEqual(grant, item))
        //     // assert(_.isEqual(item, item2))

        //     // Next we apply a new grant that revokes access
        //     // let grant2 = { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: [] }
        //     // ac.setGrants([grant2])

        //     // permission = ac.can('admin').createAny('eventstore')
        //     // assert(!permission.granted, "expect admin can not create any eventstore now")


        //     // // Now we do the same in Ethereum

        //     // tx = await tac.setGrant('admin', 'eventstore', 'create:any', [])
        //     // item = grantItemFromEvent(tx.logs[0].args)

        //     // grantValues = await tac.getGrant.call(1)
        //     // item2 = grantItemFromValues(grantValues)

        //     // assert(_.isEqual(grant2, item))
        //     // assert(_.isEqual(item, item2))
        // })


        // describe('Happy Path', async () => {

        //     it('Admins can do anything users cannot', async () => {
        //         var ac = new AccessControl()

        //         let grantList = [
        //             { role: 'admin', resource: 'eventstore', action: 'create:any', attributes: ['*'] },
        //             { role: 'admin', resource: 'eventstore', action: 'read:any', attributes: ['*'] },
        //             { role: 'admin', resource: 'eventstore', action: 'update:any', attributes: ['*'] },
        //             { role: 'admin', resource: 'eventstore', action: 'delete:any', attributes: ['*'] },

        //             { role: 'user', resource: 'eventstore', action: 'create:own', attributes: ['*'] },
        //             { role: 'user', resource: 'eventstore', action: 'read:any', attributes: ['*'] },
        //             { role: 'user', resource: 'eventstore', action: 'update:own', attributes: ['*'] },
        //             { role: 'user', resource: 'eventstore', action: 'delete:own', attributes: ['*'] }
        //         ]

        //         ac.setGrants(grantList)

        //         let permission = ac.can('admin').createAny('eventstore')
        //         assert(permission.granted, "expect admin can create any eventstore")

        //         permission = ac.can('user').createOwn('eventstore')
        //         assert(permission.granted, "expect user can create their own eventstore")

        //         permission = ac.can('user').createAny('eventstore')
        //         assert(!permission.granted, "expect user can not create any eventstore")

        //         // console.log(await globalACL.creator())

        //     })

        // })

        // describe('TDD', async () => {

        //     it('can save grants to file', async () => {
        //         var grantsObject = {
        //             admin: {
        //                 eventstore: {
        //                     'create:any': ['*'],
        //                     'read:any': ['*'],
        //                     'update:any': ['*'],
        //                     'delete:any': ['*']
        //                 }
        //             },
        //             user: {
        //                 eventstore: {
        //                     'create:own': ['*'],
        //                     'read:own': ['*'],
        //                     'update:own': ['*'],
        //                     'delete:own': ['*']
        //                 }
        //             }
        //         };
        //         var ac = new AccessControl(grantsObject);
        //         let grants = ac.getGrants()
        //         fs.writeFileSync('./test/Security/grants.json', JSON.stringify(grants, null, 4) , 'utf-8'); 
        //     })

        //     it('can read grants to file', async () => {
        //         var grantsObject = require('./grants.json')
        //         var ac = new AccessControl(grantsObject);
        //         let grants = ac.getGrants()
        //     })

        //     it('can update grants and save them to file', async () => {
        //         var grantsObject = require('./grants.json')
        //         var ac = new AccessControl(grantsObject);
        //         ac
        //         .grant('goblin')                    // switch to another role without breaking the chain 
        //             .extend('user')                 // inherit role capabilities. also takes an array 

        //         let grants = ac.getGrants()
        //         fs.writeFileSync('./test/Security/grants.json', JSON.stringify(grants, null, 4) , 'utf-8'); 
        //     })

        //     it('can read updated grants from file', async () => {
        //         var grantsObject = require('./grants.json')
        //         var ac = new AccessControl(grantsObject);
        //         let permission = ac.can('goblin').createAny('eventstore')
        //         // console.log(grants)
        //         console.log(permission.granted)
        //     })
        // })

        // describe('Middleware supports a grantsObject', async () => {

        //     var grantsObject = {
        //         admin: {
        //             eventstore: {
        //                 'create:any': ['*'],
        //                 'read:any': ['*'],
        //                 'update:any': ['*'],
        //                 'delete:any': ['*']
        //             }
        //         },
        //         user: {
        //             eventstore: {
        //                 'create:own': ['*'],
        //                 'read:own': ['*'],
        //                 'update:own': ['*'],
        //                 'delete:own': ['*']
        //             }
        //         }
        //     };

        //     it('should initialize ac in node from object', async () => {
        //         var ac = new AccessControl(grantsObject);
        //     })
        // })

        // it('', async () => {

        //     var ac = new AccessControl();

        //     ac.grant('user')                    // define new or modify existing role. also takes an array. 
        //         .createOwn('eventstore')             // equivalent to .createOwn('eventstore', ['*']) 
        //         .deleteOwn('eventstore')
        //         .readAny('eventstore')

        //         .grant('admin')                   // switch to another role without breaking the chain 
        //         .extend('user')                 // inherit role capabilities. also takes an array 
        //         .updateAny('eventstore', ['title'])  // explicitly defined attributes 
        //         .deleteAny('eventstore');

        //     var permission = ac.can('user').createOwn('eventstore');
        //     console.log(permission.granted);    // —> true 
        //     console.log(permission.attributes); // —> ['*'] (all attributes) 

        //     permission = ac.can('admin').updateAny('eventstore');
        //     console.log(permission.granted);    // —> true 
        //     console.log(permission.attributes); // —> ['title'] 

        // })

        // describe('Middleware confirms equivalence', async () => {

        //     it('should set/get grants any time', async () => {
        //         var ac = new AccessControl();
        //         ac.setGrants(grantsObject);
        //         console.log(ac.getGrants());
        //     })
        // })

    })
})
