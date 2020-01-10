import DataService from '../services/DataService'
const axios = require('axios')

const ListData = function () {
    var items = DataService.get(axios)

    return items
}

module.exports = {
    ListData
}