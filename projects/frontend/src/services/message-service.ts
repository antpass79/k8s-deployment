import Axios, { AxiosInstance } from 'axios';

export class MessageService {

    private _axiosInstance: AxiosInstance;

    constructor() {
        this._axiosInstance = Axios.create({
            baseURL: (window as any)._env_.SERVER_ENDPOINT
        });
    }

    async send(message: string) {
        return this._axiosInstance.post('/messageapi/send', { message: message });
    }

    async getAll() {
        return this._axiosInstance.get('/messageapi/getall');
    }

    async deleteAll() {
        return this._axiosInstance.post('/messageapi/deleteall');
    }
}