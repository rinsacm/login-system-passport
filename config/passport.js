
var express = require('express');
var router = express.Router();
let passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
let bcrypt=require('bcrypt-nodejs');
let dbconnect=require('../dbconfig/db-connect')
let flash=require('connect-flash')
let session=require('express-session')

passport.serializeUser(function(user, done) {
    console.log(user)
    console.log("serialized")
    console.log(user._id)

    done(null,user._id);
});
passport.deserializeUser(function(id, done) {
    dbconnect.get().collection('users').find({_id:id}, function(err, user) {

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
                console.log('not user')
                return done(null, false, {message: 'User not found.'});
            }
            if(user){

                if(!bcrypt.compareSync(password,user.password))
                    return done(null, false, {message: 'Wrong Password'});
                console.log("us"+user.email)




            }
            done(null,user)




        });

    }
));

module.exports = router;



