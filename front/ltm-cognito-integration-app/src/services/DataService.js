const get = function (axios) {
    return axios.get(process.env.API_SERVICE_URL)
}

export default {
    get: get
}