import * as _ from 'lodash'

import { ITransmuteFramework } from '../../TransmuteFramework'

import * as Common from '../Utils/Common'

import {
    readModel as permissionsReadModel,
    reducer as permissionsReducer
} from './Reducer'

export interface IPermissions {

    setAddressRole: (
        acc: any,
        fromAddress: string,
        targetAddress: string,
        targetRole: string
    ) => Promise<any>

    setGrant: (
        acc: any,
        fromAddress: string,
        role: string,
        resource: string,
        action: string,
        attributes: string[]
    ) => Promise<any>

    getGrant: (
        acc: any,
        fromAddress: string,
        index: number
    ) => Promise<any>

    canRoleActionResource: (
        acc: any,
        fromAddress: string,
        role: string,
        action: string,
        resource: string
    ) => Promise<boolean>

    getPermissionsReadModel: (acc: any, fromAddress: string) => Promise<Common.IReadModel>
}

export class Permissions implements IPermissions {

    constructor(
        public framework: ITransmuteFramework,
    ) {
    }

    setAddressRole = async (acc, fromAddress, targetAddress: string, targetRole: string) => {
        let tx = await acc.setAddressRole(targetAddress, targetRole, {
            from: fromAddress,
            gas: 2000000
        })
        let fsa = Common.getFSAFromEventArgs(tx.logs[0].args)
        return {
            events: [fsa],
            tx: tx
        }
    }

    setGrant = async (acc: any, fromAddress: string, role: string, resource: string, action: string, attributes: string[]) => {
        let tx = await acc.setGrant(role, resource, action, attributes, {
            from: fromAddress,
            gas: 2000000
        })
        // second event is EsEvent...
        let fsa = Common.getFSAFromEventArgs(tx.logs[1].args)
        return {
            events: [fsa],
            tx: tx
        }
    }

    getGrant = async (acc, fromAddress, index: number) => {
        let grantVals = await acc.getGrant.call(index, {
            from: fromAddress,
            gas: 2000000
        })
        let grant = Common.grantItemFromValues(grantVals)
        return grant
    }

    canRoleActionResource = async (acc: any, fromAddress: string, role: string, action: string, resource: string): Promise<boolean> => {
        let vals = await acc.canRoleActionResource.call(role, action, resource, {
            from: fromAddress,
            gas: 2000000
        })
        return vals[0]
    }

    // NOT OPTIMIZED - WILL BE SLOW
    // NEED TO IMPLEMENT CACHIN...
    async getPermissionsReadModel(acc: any, fromAddress: string): Promise<any> {
        // console.log('getGrants...')
        let events = await this.framework.EventStore.readFSAs(acc, fromAddress, 0)
        // console.log(events)
        events = _.filter(events, (event: Common.IFSAEvent) => {
            return event.type === 'AC_GRANT_WRITTEN'
        })
        events = events.map(async (event) =>{
            event.payload.grant = await this.getGrant(acc, fromAddress, event.payload.index)
            event.meta.extended = ['grant']
            return event
        })
        events = await Promise.all(events)
        let readModel = this.framework.ReadModel.readModelGenerator(permissionsReadModel, permissionsReducer, events)
        readModel.contractAddress = acc.address
        readModel.readModelStoreKey = `${readModel.readModelType}:${readModel.contractAddress}`
        return readModel
    }

}
