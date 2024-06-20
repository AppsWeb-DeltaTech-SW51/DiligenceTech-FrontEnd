import axios from "axios";

export default axios.create({
    baseURL: 'https://jsondatabase.onrender.com',
    headers: { 'Content-type': 'application/json' }
})