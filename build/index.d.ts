import { IReadModel } from './EventStore/ReadModel/ReadModel';
export declare const TransmuteFramework: {
    EventStore: {
        ES: any;
        readEvent: (es: any, eventId: any) => Promise<{
            Id: any;
            Type: any;
            Created: any;
            IntegrityHash: any;
            PropertyCount: any;
        }>;
        readEvents: (es: any, eventId?: number) => Promise<any[]>;
        writeEvent: (es: any, transmuteEvent: any, fromAddress: any) => Promise<{}>;
        writeEvents: (es: any, eventArray: any, fromAddress: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    };
    Persistence: {
        getItem: (key: any) => Promise<{}>;
        setItem: (key: any, value: any) => Promise<{}>;
    };
    ReadModel: {
        readModelGenerator: (readModel: IReadModel, reducer: any, events: Object[]) => IReadModel;
        maybeSyncReadModel: (es: any, readModel: IReadModel, reducer: any) => Promise<{}>;
    };
};
