const express = require('express')
const router = express.Router()
const User = require('../models/User')

var resData = {}
router.use(function (req, res, next) {
  resData = {
    code: 0,
    message: ''
  }
  next()
})

router.post('/user/register', function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const repassword = req.body.repassword

  if (username === '') {
    resData.code = 1
    resData.message = '用户名不能为空'
    res.json(resData)
    return
  }
  if (password === '') {
    resData.code = 2
    resData.message = '密码不能为空'
    res.json(resData)
    return
  }
  if (password !== repassword) {
    resData.code = 3
    resData.message = '两次输入的密码必须一致'
    res.json(resData)
    return
  }
  User.findOne({
    username: username
  }).then(function (userInfo) {
    // 有记录
    if (userInfo) {
      resData.code = 4
      resData.message = '用户名已被注册'
      res.json(resData)
      return
    }
    var user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function (newUserInfo) {
    console.log('新注册用户')
    console.log(newUserInfo)
    resData.message = '注册成功'
    res.json(resData)
  })
})

router.post('/user/login', function (req, res, next) {
  const username = req.body.username
  const password = req.body.password

  if (username === '' || password === '') {
    resData.code = 1
    resData.message = '用户名和密码不能为空'
    res.json(resData)
    return
  }

  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      resData.code = 2
      resData.message = '用户名或密码错误'
      res.json(resData)
      return
    }
    resData.message = '登录成功'
    resData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    console.log('该用户登录')
    console.log(userInfo)
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(resData)
    return
  })
})

router.get('/user/logout', function(req,res,next){
  req.cookies.set('userInfo', null)
  res.json(resData)
})



module.exports = router