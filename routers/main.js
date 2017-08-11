const express = require('express')
const router = express.Router()

const Content = require('../models/Content')
const Category = require('../models/Category')

router.get('/', function (req, res, next) {
  var page = Number(req.query.page || 1)
  var pages = 0
  var limit = 1

  Content.count().then(function (count) {
    //总页数
    pages = Math.ceil(count / limit)
    //page取值范围
    page = Math.min(page, pages)
    // 不能小于1
    page = Math.max(page, 1)

    var skip = (page - 1) * limit
    Content.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (contents) {
      console.log(contents)
      res.render('index', {
        userInfo: req.userInfo,
        contents: contents,
        page: page,
        pages: pages
      })
    })
  })
})




module.exports = router