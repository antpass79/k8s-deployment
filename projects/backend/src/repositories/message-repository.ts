import { BaseRepository } from "../utilities/repositories/base-repository";
import { Message } from "../models/message";

export class MessageRepository extends BaseRepository<Message> {
    async deleteAll() {
        await this._collection.deleteMany({});
    }

    async saveAll(messages: Array<Message>) {
        messages.forEach(message => this.create(message));
    }
}