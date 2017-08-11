const mongoose = require('mongoose')

module.exports = new mongoose.Schema({

  // 关联字段
  category: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    // 引用Model
    ref: 'Category'
  },

  title: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 添加时间
  addTime: {
    type: Date,
    default: new Date()
  },

  // 阅读量
  views: {
    type: Number,
    default: 0
  },

  desc: {
    type: String,
    default: ''
  },


  content: {
    type: String,
    default: ''
  }
})