import * as express from "express";
import { WebController } from "../controllers/web-controller";

export class WebRoute {

    private webController: WebController;

    constructor() {
        this.webController = new WebController();
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.post('/send', (req, res) => this.webController.sendMessage(req, res));
        router.post('/deleteall', (req, res) => this.webController.deleteMessages(req, res));
        router.get('/getall', (req, res) => this.webController.getMessages(req, res));

        return router;
    }
}