import axios, { AxiosInstance } from 'axios';

class HttpService {
    protected httpClient: AxiosInstance;

    constructor(baseURL: string) {
        this.httpClient = axios.create({
            baseURL: baseURL,
        });
    }
}

export default HttpService;
