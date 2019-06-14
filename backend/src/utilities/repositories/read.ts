//  https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e

export interface IRead<T> {
    find(item: T): Promise<T[]>;
    findOne(id: string): Promise<T>;
    findAll(): Promise<T[]>;
}