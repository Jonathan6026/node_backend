// 创建 config.js 文件，向外共享 加密 和 还原 Token的jwtSecretKey
// 定义加密secret密钥

module.exports = {
    //加密和解密的token 密钥
    jwtSecretKey: 'Jonathan Node Backend',
    //token的有效期
    expiresIn:'10h'
}