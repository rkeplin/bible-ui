import Config from '../Config';
import HttpService from '../core/HttpService';
import { AxiosResponse, AxiosError } from 'axios';

export interface IUser {
    dateRegistered: string;
    email: string;
    id: string;
}

class UserService extends HttpService {
    constructor() {
        super(Config.USER_API);
    }

    public async login(email: string, password: string): Promise<any> {
        return this.httpClient
            .post(
                'authenticate',
                {
                    email: email,
                    password: password,
                },
                { withCredentials: true },
            )
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async register(email: string, password: string, passwordConf: string): Promise<any> {
        return this.httpClient
            .post(
                'register',
                {
                    email: email,
                    password: password,
                    passwordConf: passwordConf,
                },
                { withCredentials: true },
            )
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async me(): Promise<IUser> {
        return this.httpClient
            .get('authenticate/me', { withCredentials: true })
            .then((response: AxiosResponse) => {
                return {
                    dateRegistered: response.data.dateRegistered,
                    email: response.data.email,
                    id: response.data.id,
                };
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }

    public async logout(): Promise<any> {
        return this.httpClient
            .get('authenticate/logout', { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response;
            })
            .catch((reason: AxiosError) => {
                return Promise.reject(reason);
            });
    }
}

export default UserService;
