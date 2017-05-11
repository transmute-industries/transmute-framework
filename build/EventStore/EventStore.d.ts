export declare const readEvent: (es: any, eventId: any) => Promise<{
    Id: any;
    Type: any;
    Created: any;
    IntegrityHash: any;
    PropertyCount: any;
}>;
export declare const readEvents: (es: any, eventId?: number) => Promise<any[]>;
export declare const writeEvent: (es: any, transmuteEvent: any, fromAddress: any) => Promise<{}>;
export declare const writeEvents: (es: any, eventArray: any, fromAddress: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
export declare const EventStore: {
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
