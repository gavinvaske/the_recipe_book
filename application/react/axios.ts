import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.BASE_URL as string,
});

export default instance;