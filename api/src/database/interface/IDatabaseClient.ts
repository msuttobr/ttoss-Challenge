export interface IDatabaseClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query(query: string, params: any[]): Promise<any>;
}