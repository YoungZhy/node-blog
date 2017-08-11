const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/Category')
const Content = require('../models/Content')

router.use(function (req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，你不是管理员')
  } else {
    next()
  }
})
router.get('/', function (req, res) {
  res.render('admin/admin_index', {
    userInfo: req.userInfo
  })
})

/* 
  用户首页
*/
router.get('/user', function (req, res) {

  /* 
    数据库读取所有user信息 
    limit(Number)限制获取数据条数
    skip(5) 忽略条数
    1: 1-5 skip:0 --> skip: (当前页 - 1) * limit()
    2: 6-10 skip:5
  */
  var page = Number(req.query.page || 1)
  var pages = 0
  var limit = 5

  User.count().then(function (count) {
    //总页数
    pages = Math.ceil(count / limit)
    //page取值范围
    page = Math.min(page, pages)
    // 不能小于1
    page = Math.max(page, 1)
    var skip = (page - 1) * limit

    // .sort({})数据输出排序, 1:升序 -1:降序
    User.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (users) {
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        page: page,
        pages: pages
      })
    })
  })

})

/* 
  分类首页
*/
router.get('/category', function (req, res) {

  var page = Number(req.query.page || 1)
  var pages = 0
  var limit = 5

  Category.count().then(function (count) {
    //总页数
    pages = Math.ceil(count / limit)
    //page取值范围
    page = Math.min(page, pages)
    // 不能小于1
    page = Math.max(page, 1)

    var skip = (page - 1) * limit
    Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then(function (categories) {

      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        page: page,
        pages: pages
      })
    })
  })
})

/* 
  分类添加
*/
router.get('/category/add', function (req, res) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})

/* 
  分类添加post保存
*/
router.post('/category/add', function (req, res) {

  var name = req.body.name || ''
  if (name === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空'
    })
    return
  }

  // 验证数据库是否存在
  Category.findOne({
    name: name
  }).then(function (result) {
    if (result) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '该分类已存在'
      })
      return Promise.reject()
    } else {
      //不存在
      var category = new Category({
        name: name
      })
      return category.save()
    }
  }).then(function (newCategory) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类添加成功',
      url: '/admin/category'
    })
  })
})

/* 
  分类修改
*/
router.get('/category/edit', function (req, res) {

  // 获取要修改分类信息，用表单展示
  var id = String(req.query.id || '')
  Category.findOne({
    _id: id   // 注意数据库key
  }).then(function (category) {
    if (!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
      return Promise.reject()
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      })
    }
  })
})

/* 
  分类修改post保存
*/
router.post('/category/edit', function (req, res) {
  var id = String(req.query.id || '')
  // post提交过来的名称
  var name = String(req.body.name || '')

  Category.findOne({
    _id: id   // 注意数据库key
  }).then(function (category) {
    if (!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
      return Promise.reject()
    } else {
      //当没有做修改时提交
      if (name === category.name) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/category'
        })
        return Promise.reject()
      } else if (name === '') {
        res.render('admin/error', {
          userInfo: req.userInfo,
          message: '名称不能为空'
        })
        return Promise.reject()
      } else {
        // 要修改的分类名称是否已经在数据库中
        return Category.findOne({
          _id: { $ne: id },
          name: name
        })
      }
    }
  }).then(function (sameCategory) {
    if (sameCategory) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '该名称已存在数据库中'
      })
      return Promise.reject()
    } else {
      return Category.update({
        _id: id
      }, {
          name: name
        })
    }
  }).then(function () {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '修改成功',
      url: '/admin/category'
    })
  })

})

/* 
  分类删除
*/
router.get('/category/delete', function (req, res) {

  var id = String(req.query.id || '')

  Category.remove({
    _id: id
  }).then(function () {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})

/* 
  内容首页
*/
router.get('/content', function (req, res) {
  
  var page = Number(req.query.page || 1)
  var pages = 0
  var limit = 5

  Content.count().then(function (count) {
    //总页数
    pages = Math.ceil(count / limit)
    //page取值范围
    page = Math.min(page, pages)
    // 不能小于1
    page = Math.max(page, 1)

    var skip = (page - 1) * limit
    Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category']).then(function (contents) {
      console.log(contents)
      res.render('admin/content_index', {
        userInfo: req.userInfo,
        contents: contents,
        page: page,
        pages: pages
      })
    })
  })
})
/* 
  内容添加
*/
router.get('/content/add', function (req, res) {
  Category.find().then(function (categories) {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
})

/* 
  内容添加post保存
*/
router.post('/content/add', function (req, res) {
  // console.log(req.body)
  if (req.body.category === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '请选择内容分类'
    })
    return
  }
  if (req.body.title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '请填写内容标题'
    })
    return
  }

  // 保存到数据库

  new Content({
    category: req.body.category,
    title: req.body.title,
    user: req.userInfo._id.toString(),
    desc: req.body.desc,
    content: req.body.content
  }).save().then(function (rs) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '内容保存成功',
      url: '/admin/content'
    })
  })
})

/* 
  内容修改
*/
router.get('/content/edit', function(req,res){

  var id = String(req.query.id || '')
  var categories = []

  Category.find().then(function (rs) {
    categories = rs
    return Content.findOne({
      _id: id
    }).populate('category')
  }).then(function(content){
    if(!content){
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '指定内容不存在'
      })
      return Promise.reject()
    }else{
      res.render('admin/content_edit', {
        userInfo: req.userInfo,
        content: content,
        categories: categories
      })
    }
  })
})

/* 
  内容修改post保存
*/
router.post('/content/edit', function (req, res) {
  // console.log(req.body)
  var id = String(req.query.id || '')
  if (req.body.category === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '请选择内容分类'
    })
    return
  }
  if (req.body.title === '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '请填写内容标题'
    })
    return
  }

  // 保存到数据库

  Content.update({
    _id: id
  },{
    category: req.body.category,
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content
  }).then(function (rs) {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '内容修改成功',
      url: '/admin/content'
    })
  })
})

/* 
  分类删除
*/
router.get('/content/delete', function (req, res) {

  var id = String(req.query.id || '')

  Content.remove({
    _id: id
  }).then(function () {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/content'
    })
  })
})

module.exports = router