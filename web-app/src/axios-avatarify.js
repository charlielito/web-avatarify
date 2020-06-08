import axios from 'axios';

const tokenAuth = process.env.REACT_APP_API_TOKEN;
// const url = 'http://localhost:8008';
// const url = 'http://18.219.77.246';
// const url = 'http://api.liveportraits.ml';
// const url = 'http://0.0.0.0:8008';
const url = 'https://avatarify-relay-ejf7gidppa-uc.a.run.app/';

const timeoutMinutes = 1;

const instance = axios.create({
    baseURL: url,
    timeout: 1000 * 60 * timeoutMinutes,
    headers: {
        'Authorization': 'Bearer ' + tokenAuth,
        'Content-Type': 'application/json'
    }
});

export default instance;