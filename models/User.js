const mongoose = require('mongoose')
const usersSchemas = require('../schemas/users')

module.exports = mongoose.model('user',usersSchemas)