//insert express
const express = require('express')

const app = express()

//定义全局错误级别中间件.1
const joi = require('joi')

//导入cors
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件，注意：这个中间件，
// 只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({extended:false}))

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 解释token.1 在路由前配置解释Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))

// 导入 使用router模块
const userRouter = require('./router/user')
app.use('/api/sys',userRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

app.listen(3008,function() {
    console.log('app run at 3008')
})