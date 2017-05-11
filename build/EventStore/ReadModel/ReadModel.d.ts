export interface IReadModel {
    LastEvent: number;
    ReadModelStoreKey: string;
}
export declare const readModelGenerator: (readModel: IReadModel, reducer: any, events: Object[]) => IReadModel;
export declare const maybeSyncReadModel: (es: any, readModel: IReadModel, reducer: any) => Promise<{}>;
export declare const ReadModel: {
    readModelGenerator: (readModel: IReadModel, reducer: any, events: Object[]) => IReadModel;
    maybeSyncReadModel: (es: any, readModel: IReadModel, reducer: any) => Promise<{}>;
};
