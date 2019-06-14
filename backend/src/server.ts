import express from 'express';
import * as bodyParser from "body-parser";
import cors from 'cors';
import { NodeConfig } from './utilities/node-config';
import { WebRoute } from './routes/web-route';
import { MongoPool } from './utilities/database/mongo-pool';

export class Server {

    private _port: number | string;
    get port() {
        return this._port;
    }

    private _app: express.Application;

    constructor(port: number | string) {
        this._port = port;

        this._app = express();

       MongoPool.connect().then(() => {
            this.configure(this._app);
        });
    }

    start() {

        this._app.listen(this.port, () => {
            console.log('Server listening on port ' + this.port);
        });
    }

    private configure(app: express.Application) {

        this.configParser(app);
        this.configCors(app);
        this.configureRoutes(app);
    }

    private configParser(app: express.Application) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    private configCors(app: express.Application) {

        let originsWhitelist = NodeConfig.getValue('ORIGINS_WHITE_LIST');
        let corsOptions = {
            origin: (origin: any, callback: any) => {
                var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
                callback(null, isWhitelisted);
            },
            credentials: true
        }
        app.use(cors(corsOptions));
    }

    private configureRoutes(app: express.Application) {

        let gameRoute = new WebRoute();
        app.use('/messageapi', gameRoute.initRoute());
    }
}