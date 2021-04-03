import Config from '../Config';
import HttpService from '../core/HttpService';
import { AxiosResponse, AxiosError } from 'axios';
import { IVerse } from '../book/BookService';

export interface IList {
    id: string;
    name: string;
    dateAdded: string;
    dateUpdated?: string;
}

interface IID {
    id: string;
}

interface IUser {
    id: string;
    email: string;
}

export interface IListVerse {
    dateAdded: string;
    id: string;
    list: IID;
    text: IVerse;
    translation: string;
    user: IUser;
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

    public getVerses(listId: string): Promise<IListVerse[]> {
        return this.httpClient
            .get('lists/' + listId + '/verses', { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public addVerse(listId: string, verseId: number, translation: string) {
        return this.httpClient
            .put('lists/' + listId + '/verses/' + verseId + '?translation=' + translation, null, {
                withCredentials: true,
            })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public removeVerse(listId: string, verseId: number, translation: string) {
        return this.httpClient
            .delete('lists/' + listId + '/verses/' + verseId + '?translation=' + translation, { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }
}

export default ListService;
