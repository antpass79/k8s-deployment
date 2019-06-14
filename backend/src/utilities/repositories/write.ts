//  https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e

export interface IWrite<T> {
    create(item: T): Promise<{ ok: boolean, insertedId: string }>;
    update(id: string, item: T): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}