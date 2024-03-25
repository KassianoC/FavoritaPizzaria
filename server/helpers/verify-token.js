const jwt = require ('jsonwebtoken')
const getToken = require ('./get_token')

const checkToken = (req,res,next) => {
    if(!req.headers.authorization){
        res.send({msg: 'Não veio nada no Authorization'})
    }
    const token = getToken(req)
    if(!token){
        res.send({msg: 'Acesso negado!'})
    }
    try {
        const verified = jwt.verify(token, 'kjkszpj')
        req.user = verified
        next()
    } catch (error) {
        return res.send({msg: 'Token invalido!'})
    }
}
module.exports = checkToken
