import { Server } from './server';
import { NodeConfig } from './utilities/node-config';

NodeConfig.init();

const port = NodeConfig.getValue("SERVER_PORT");

let server = new Server(port);
server.start();