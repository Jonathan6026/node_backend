// 因为下面操作涉及数据库操作 所以导入数据库模块
const db = require('../db/index')

// 导入bcrypt.js
const bcrypt = require('bcryptjs')

// 导入生成Token包 通过jwt的包的sign方法，
// 传入密钥，对用户信息加密生成token
const jwt = require('jsonwebtoken')

// 导入全局配值的 token 密钥
const config = require('../config')
const { append } = require('express/lib/response')

// regUser是注册新用户的函数
exports.regUser = (req,res) => {
    // 获取客户端提交的表单信息
    const userinfo = req.body
    console.log(userinfo)
    if (!userinfo.username || !userinfo.password) {
        return res.send({status:1,message:'username或password不能为空'})
    }
    //定义sql语句，查询用户名是否存在
    let theMessage = ''
    const sqlStr = 'select * from ev_users where username=?'
    //执行 SQL 语句 
    db.query(sqlStr,userinfo.username,(err,results) => {
        // 通过调用expressJoi验证规则代替 旧检查方案如果执行有错误
    //     if (err) {
    //         //theMessage = {status:1,message:err.message}
    //         return res.send({status:1,message:err.message})
    //     } 
    //     // 如果用户名重复
    //    if (results.length>0) {
    //        //theMessage = {status:1,message:'username已被占用，请更换其他username'}
    //        return res.send({status:1,message:'username已被占用，请更换其他username'})       
    //     }
       // 调用bcrypt.hashSync()对密码进行加密
       userinfo.password = bcrypt.hashSync(userinfo.password,10)
       console.log(userinfo.password)
       console.log(results)
       // 定义插入新用户的 SQL 语句
        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            // 判断影响行数是否为 1
            // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            // 注册用户成功
            // res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
        })
    })
}

exports.login = (req,res) => {
    // 获取客户端提交的表单信息
    const userinfo = req.body
    console.log(userinfo)
    const sql = 'select * from ev_users where username=?'
    //z执行SQL
    db.query(sql,userinfo.username,(err,results) => {
        console.log(results)

        //如果SQL语句执行失败
        if (err) return res.cc(err)

        //如果SQL语句执行成功，但是长度不等于1
        if (results.length !== 1) return res.cc('登录失败！')
        
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if (!compareResult) return res.cc('密码错误，登录失败！')

        //通过jsonwebtoken生成token
        const user = { ...results[0],password:'',user_pic:''}
        console.log(user)

        //通过token包，传入用户信息，传入密钥，生成token
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{ expiresIn:config.expiresIn })
        
        //调用send 把token响应给客户端
        res.send({
            status:0,
            message: '登录成功！',
            token: tokenStr
        })
        
    })
}