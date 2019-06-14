import { MessageRepository } from "../repositories/message-repository";
import { MongoPool } from "../utilities/database/mongo-pool";
import { Guid } from "../utilities/guid";

export class WebController {

    messageRepository: MessageRepository;

    constructor() {
        this.messageRepository = new MessageRepository(MongoPool.instance, 'messages');
    }

    async sendMessage(req: any, res: any) {

        try {            
            let message: string = req.body.message;

            console.log("sendMessage: " + message);

            if (message) {
                await this.messageRepository.create({
                    id: Guid.newGuid(),
                    text: message
                })
                res.send(message);
            }
            else
                res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getMessages(req: any, res: any) {

        try {
            // let messages = [
            //     'message 0',
            //     'message 1',
            //     'message 2'
            // ];

            // res.send(messages);
            let messages = await this.messageRepository.findAll();

            console.log("getMessages: " + messages.length);

            res.send(messages);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async deleteMessages(req: any, res: any) {

        try {
            // res.send('deleteMessages');
            await this.messageRepository.deleteAll();

            console.log("deleteMessages");

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }    
}