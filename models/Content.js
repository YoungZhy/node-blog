const mongoose = require('mongoose')
const contentsSchemas = require('../schemas/contents')

module.exports = mongoose.model('Content',contentsSchemas)