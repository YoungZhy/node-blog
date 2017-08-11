const mongoose = require('mongoose')
const categoriesSchemas = require('../schemas/categories')

module.exports = mongoose.model('Category',categoriesSchemas)