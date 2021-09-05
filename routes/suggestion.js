const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
var users = require('../inc/users')

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    if (req.headers['x-access-token'] !== process.env.SECRET) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      next();
}

router.post('/', verifyJWT, (req, res)=>{

  let fields = {}
  fields.name = req.body.nome;
  fields.email = req.body.email;
  fields.password = req.body.password;

  users.saveSuggestion(fields).then(results=>{
    res.json({message:"Sucesso!"});
  }).catch(err=>{
    res.send(err)
  })
})

module.exports = router;