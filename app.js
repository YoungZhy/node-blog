const express = require("express")
const swig = require("swig")
const mongoose = require("mongoose")
// 用来处理psot提交过来的数据
const bodyParser = require("body-parser")
// 保存状态
const Cookies = require('cookies')

const User = require('./models/User')

const app = express()

// 设置静态文件托管，js/css
// 当访问的url以/public开始，直接返回__dirname + "/public"下的文件
app.use("/public", express.static(__dirname + "/public"))


// 配置应用模版
// 定义当前应用使用的模版引擎
// 参数一：模版引擎名称，后缀；参数二：用于解析处理模版内容的方法
app.engine("html", swig.renderFile)
// 设置模版存放目录，参数一必须是view，参数二是目录
app.set("views", "./views")
// 注册所使用的模版引擎，参数一必须是view engine，参数二和app.engine定义一致
app.set("view engine", "html")

// 在开发过程中取消模版缓存，无需重启node
swig.setDefaults({ cache: false })

// body-parse设置
app.use(bodyParser.urlencoded({ extended: true }))

// cookie设置
app.use(function (req, res, next) {
	req.cookies = new Cookies(req, res)
	// 解析cookies
	// 全局保存
	req.userInfo = {}
	if (req.cookies.get('userInfo')) {
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'))
			// 判断是否管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
				next()
			})
		}catch(e){}
	}else{
		next()
	}
})


// 根据不同功能划分模块
app.use("/admin", require("./routers/admin"))
app.use("/api", require("./routers/api"))
app.use("/", require("./routers/main"))


// app.get('/', function(req, res, next){
// 	// res.send('<h1>博客</h1>');

// 	// 读取views目录下的指定文件，解析并返回给客户端
// 	// 参数一：模版文件，相对于views目录 views/index.html
// 	// 参数二：传递给模版使用的数据
// 	res.render("index")
// })

// app.get("/main.css", function(req, res, next){
// 	res.setHeader("content-type", "text/css")
// 	res.send("body { background:red; }")
// })
// app.listen(8888)

// 用户发送http请求 - url - 解析路由 - 找到匹配规则 - 执行指定的绑定函数 - 返回内容
// /public - 静态 - 直接读取指定目录下的文件 - 返回内容
// - 动态 - 处理业务逻辑，加载解析模版 - 返回内容


mongoose.connect("mongodb://localhost:27018/blog", function (err) {
	if (err) {
		console.log("数据库连接失败")
	} else {
		console.log("数据库连接成功")
		app.listen(8888)
	}
})