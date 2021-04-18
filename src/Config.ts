const API = 'http://bible-go-api.rkeplin.com/v1';
const USER_API = 'http://bible-php-api.rkeplin.com/v1';

class Config {
    public static readonly API = process.env.REACT_APP_API_URL || API;
    public static readonly USER_API = process.env.REACT_APP_USER_API_URL || USER_API;
}

export default Config;
