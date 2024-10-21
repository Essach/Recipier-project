import axios from "axios";

const request = axios.create({
    baseURL: "https://recipier-project-39to.vercel.app/",
});

export default request;
