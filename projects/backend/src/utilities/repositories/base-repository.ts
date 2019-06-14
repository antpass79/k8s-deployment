//  https://hackernoon.com/generic-repository-with-typescript-and-node-js-731c10a1b98e

import { Db, Collection, InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject } from 'mongodb';

import { IWrite } from "./write";
import { IRead } from "./read";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

    public readonly _collection: Collection;

    constructor(db: Db, collectionName: string) {
        this._collection = db.collection(collectionName);
    }

    async create(item: T): Promise<{ ok: boolean, insertedId: string }> {
        const result: InsertOneWriteOpResult = await this._collection.insertOne(item);

        return {
            ok: !!result.result.ok,
            insertedId: result.insertedId.toHexString()
        };
    }

    async update(id: string, item: T): Promise<boolean> {
        const result: UpdateWriteOpResult = await this._collection.updateOne({ _id: id }, { '$set': { item: item } });
        return !!result.result.ok;
    }

    async delete(id: string): Promise<boolean> {
        const result: DeleteWriteOpResultObject = await this._collection.deleteOne({ _id: id });
        return !!result.result.ok;
    }

    async find(item: T): Promise<T[]> {
        throw new Error('Method not implemented.');
    }

    async findOne(id: string): Promise<T> {
        const found = await this._collection.findOne({ _id: id });
        return found;
    }

    async findAll(): Promise<T[]> {
        const found = await this._collection.find({}).toArray();
        return found;
    }
}