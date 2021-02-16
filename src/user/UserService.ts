import Config from '../Config';
import HttpService from '../core/HttpService';
import { AxiosResponse, AxiosError } from 'axios';

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

    public async me(): Promise<any> {
        return this.httpClient
            .get('authenticate/me', { withCredentials: true })
            .then((response: AxiosResponse) => {
                return response;
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
