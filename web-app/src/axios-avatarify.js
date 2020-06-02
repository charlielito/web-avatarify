import axios from 'axios';

const tokenAuth = 'sisa';
const url = 'http://localhost:8008';
const timeoutMinutes = 1;
// const url = 'http://3.20.236.86:8008';

const instance = axios.create({
    baseURL: url,
    timeout: 1000 * 60 * timeoutMinutes,
    headers: {
        'Authorization': 'Bearer ' + tokenAuth,
        'Content-Type': 'application/json'
    }
});

export default instance;