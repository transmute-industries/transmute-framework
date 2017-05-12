import { ReadModel } from '../ReadModel/ReadModel';
export declare module EventStore {
    const ReadModelGenerator: typeof ReadModel;
    const ES: any;
    const readEvent: (es: any, eventId: any) => Promise<{
        Id: any;
        Type: any;
        Created: any;
        IntegrityHash: any;
        PropertyCount: any;
    }>;
    const readEvents: (es: any, eventId?: number) => Promise<any[]>;
    const writeEvent: (es: any, transmuteEvent: any, fromAddress: any) => Promise<{}>;
    const writeEvents: (es: any, eventArray: any, fromAddress: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
}
