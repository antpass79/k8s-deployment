import { MongoClient } from "mongodb";
import { NodeConfig } from "../node-config";

export class MongoPool {

    private static _db: any;
    static get instance() {
        return MongoPool._db;
    }

    static async connect() {
        console.log('connecting to mongodb');

        try {
            if (!MongoPool._db) {
                console.log('setting client');
                let client = await MongoClient.connect(NodeConfig.getValue("CONNECTION_STRING"), { useNewUrlParser: true })
                MongoPool._db = client.db(NodeConfig.getValue("DATABASE_NAME"));
                console.log(MongoPool._db);
            }
        } catch (error) {
            console.log('error during connecting to mongodb: ');
            console.error(error);
        }
    }

    static async disconnect() {
        console.log('disconnecting to mongodb');

        try {
            if (!MongoPool._db) {
                console.log('closing client');
                (MongoPool._db as MongoClient).close();
            }
        } catch (error) {
            console.log('error during disconnecting to mongodb: ');
            console.error(error);
        }
    }
}