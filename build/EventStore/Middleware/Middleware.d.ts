export declare const solidityEventReducer: (events: any) => {};
export declare const writeSolidityEventAsync: (esInstance: any, _callerMeta: any, event: any) => Promise<{}>;
export declare const writeSolidityEventsAsync: (esInstance: any, _callerMeta: any, _events: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
export declare const readSolidityEventAsync: (esInstance: any, eventId: any) => Promise<{
    Id: any;
    Type: any;
    Created: any;
    IntegrityHash: any;
    PropertyCount: any;
}>;
export declare const readSolidityEventsAsync: (esInstance: any, eventId?: number) => Promise<any[]>;
export declare const Middleware: {
    readSolidityEventAsync: (esInstance: any, eventId: any) => Promise<{
        Id: any;
        Type: any;
        Created: any;
        IntegrityHash: any;
        PropertyCount: any;
    }>;
    readSolidityEventsAsync: (esInstance: any, eventId?: number) => Promise<any[]>;
    writeSolidityEventAsync: (esInstance: any, _callerMeta: any, event: any) => Promise<{}>;
    writeSolidityEventsAsync: (esInstance: any, _callerMeta: any, _events: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
};
