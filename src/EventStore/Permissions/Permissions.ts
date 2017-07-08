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

    canRoleActionResource: (
        acc: any,
        fromAddress: string,
        role: string,
        action: string,
        resource: string
    ) => Promise<boolean>

    getGrants: (acc: any, fromAddress: string) => Promise<any>
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

    setGrant = async (acc, fromAddress, role: string, resource: string, action: string, attributes: string[]) => {
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

    canRoleActionResource = async (acc: any, fromAddress: string, role: string, action: string, resource: string): Promise<boolean> => {
        let vals = await acc.canRoleActionResource.call(role, action, resource, {
            from: fromAddress,
            gas: 2000000
        })
        return vals[0]
    }

    async getGrants(tac: any, fromAddress: string): Promise<any> {
        // console.log('getGrants...')
        let updatedReadModel = await this.framework.ReadModel.getCachedReadModel(
            tac,
            fromAddress,
            permissionsReadModel,
            permissionsReducer
        )
        return updatedReadModel
    }

}
