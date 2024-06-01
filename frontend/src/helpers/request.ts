import axios from 'axios';

const request = axios.create({
    baseURL: 'https://recipier-api.onrender.com/'
})

export default request
