const express = require('express')

const router = express.Router()

//导入用户处理函数的模块
const user_handler = require('../router_handler/user')

//验证中间件.1导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//验证中间件.2导入需要验证的规则对象
const {reg_login_schema} = require('../schema/user')

//验证中间件.3在注册新用户中，调用expressJoi验证规则
router.post('/reguser',expressJoi(reg_login_schema),user_handler.regUser)

//验证中间件.3在登录新用户中，调用expressJoi验证规则
router.post('/login',expressJoi(reg_login_schema),user_handler.login)

module.exports = router