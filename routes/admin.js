var express = require('express');
var users = require('../inc/users')
var menusAdmin = require('../inc/menusAdmin')
var router = express.Router();

router.use(function(req, res, next){
  if(['/login'].indexOf(req.url) == -1 && !req.session.user){
    res.redirect("/admin/login")
  }else{
    next()
  }
});

router.use(function(req, res, next){
    req.menus = menusAdmin.getMenus(req);

    next()
});

router.get("/logout", (req, res)=>{
  delete req.session.user;

  res.redirect("/admin/login")
});

router.post('/login', function(req, res, next) {

  if(!req.body.email){
    users.render(req, res, "Preencha o campo e-mail.");
  } else if(!req.body.password){
    users.render(req, res, "Preencha o campo senha.");
  } else{
    users.login(req.body.email, req.body.password).then(user =>{

      req.session.user = user;

      res.redirect("/admin/")

    }).catch(err =>{

      console.log(err)

      users.render(req, res, err.message || err)

    })

  }

});

router.get('/login', function(req, res, next) {
  users.render(req, res, null)
});

router.get('/', function(req, res, next) {

  users.getMenus().then(results => {
    res.render('admin/index', {
      menus: req.menus, 
      user: req.session.user,
      ativos: results[0].qtAtivos,
      sugestoes: results[0].qtSugestoes
    })
  }).catch(err =>{
    console.log(err)
  })
});

router.get('/usuarios', function(req, res, next) {

  users.getUsers().then(allUsers => {
    res.render('admin/users', {
      menus: req.menus, 
      user: req.session.user,
      allUsers
    })
  }).catch(err =>{
    console.log(err)
  })
});

router.post('/usuarios', function(req, res, next){
  users.saveUser(req.fields).then(results=>{
    res.send(results);
  }).catch(err=>{
    res.send(err)
  })
})

router.put('/deleteUser/:id', function(req, res, next){
  users.deleteUser(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
});

router.get('/sugestoes', function(req, res, next) {
  users.getSuggestions().then(allSuggestions => {
    res.render('admin/suggestions', {
      menus: req.menus, 
      user: req.session.user,
      allSuggestions
    })
  }).catch(err =>{
    console.log(err)
  })
});

router.put('/aceitaSugestao/:id', function(req, res, next){
  users.acceptSuggestion(req.params.id).then(results=>{
    res.send(results)
  }).catch(err=>{
    res.send(err)
  })
});

module.exports = router;
