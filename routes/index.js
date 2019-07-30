var express = require('express');
var router = express.Router();
let dbconnect=require('../dbconfig/db-connect');
let bcrypt=require('bcrypt-nodejs')
let passport=require('passport')
let flash=require('connect-flash')
let session=require('express-session')

/* GET home page. */
router.get('/',checkAuthenticated, function(req, res, next) {
  res.render('index',{name:req.user.name});
});

router.get('/register',checkNotAuthenticated, function(req, res, next) {
  res.render('register')
});

router.get('/login',checkNotAuthenticated, function(req, res, next) {
  let messages=req.flash('error')
  res.render('login',{messages:messages,hasError:messages.length>0})
});

router.post('/register',checkNotAuthenticated,function (req,res,next) {
  try{
    let hashPassword=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
    let db=dbconnect.get().collection('users');
    console.log(db)
    db.insertOne({
      name:req.body.name,
      email:req.body.email,
      password:hashPassword
    })
    res.redirect('/login')
  }
  catch(e){
    res.redirect('/register')
  }

})

router.post('/logout',function (req,res,next) {
  req.logOut()
  res.redirect('/login')
})
router.post('/login',passport.authenticate('local.signin',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true
})
)

function checkAuthenticated(req,res,next)
{
  if(req.isAuthenticated())
    return next();
  res.redirect('/login')
}

function checkNotAuthenticated(req,res,next)
{
  if(req.isAuthenticated())
    return res.redirect('/')
  return next();
}

module.exports = router;
