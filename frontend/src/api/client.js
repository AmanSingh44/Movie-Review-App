import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:7000/api'
})

export default client