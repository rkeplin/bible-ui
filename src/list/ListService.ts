import Config from '../Config';
import HttpService from '../core/HttpService';
import { AxiosResponse, AxiosError } from 'axios';

export interface IList {
    id: string;
    name: string;
    dateAdded: string;
    dateUpdated?: string;
}

class ListService extends HttpService {
    constructor() {
        super(Config.USER_API);
    }

    public async getAll(): Promise<IList[]> {
        return this.httpClient
            .get('lists', { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async getOne(id: string): Promise<IList> {
        return this.httpClient
            .get('lists/' + id, { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async add(list: IList): Promise<IList> {
        return this.httpClient
            .post('lists', list, { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async update(id: string, list: IList): Promise<IList> {
        return this.httpClient
            .put('lists/' + id, list, { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async remove(id: string) {
        return this.httpClient
            .delete('lists/' + id, { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }
}

export default ListService;
