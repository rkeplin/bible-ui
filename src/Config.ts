const API = 'https://bible-go-api.rkeplin.com/v1';
const USER_API = 'https://bible-php-api.rkeplin.com/v1';

class Config {
    public static readonly API = import.meta.env.VITE_API_URL || API;
    public static readonly USER_API = import.meta.env.VITE_USER_API_URL || USER_API;
}

export default Config;
