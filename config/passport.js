
var express = require('express');
var router = express.Router();
let passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
let bcrypt=require('bcrypt-nodejs');
let dbconnect=require('../dbconfig/db-connect')
let flash=require('connect-flash')
let session=require('express-session')
let ObjectID = require('mongodb').ObjectID;

passport.serializeUser(function(user, done) {
    done(null,user._id);
});
passport.deserializeUser(function(id, done) {
    let idString=id
    objId = new ObjectID(idString);
    dbconnect.get().collection('users').findOne({_id:objId}, function(err, user) {
        done(null, user);
    });

});

passport.use('local.signin',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},
    function(req,email, password, done) {



        dbconnect.get().collection('users').findOne({email:email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {message: 'User not found.'});
            }
            if(user){

                if(!bcrypt.compareSync(password,user.password))
                    return done(null, false, {message: 'Wrong Password'});

            }
            done(null,user)




        });

    }
));

module.exports = router;



