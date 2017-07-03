const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require("../models/user-model.js");
const passport = require('passport');
const router = express.Router();

//REGISTRATION-----------------------------------------------------

router.get ('/signup', (req, res, next) => {
  if(req.user){
    res.redirect('/');
  }
  else{
    res.render('auth-views/signup-view.ejs');
  }
});

router.post('/signup', (req, res, next) => {
  if( req.body.signupUsername === '' || req.body.signupPassword === ''){
    res.locals.messageForDumbUsers = "Please provide both Email and Password!";
    res.redirect('auth-views/signup-view.ejs');
    return;
  }
  UserModel.findOne(
    {email: req.body.signupEmail},
    (err, userFromDb) => {
      if(err){
        next(err);
        return;
      }
      if(userFromDb){
        res.locals.messageForDumbUsers = "Sorry that email is already in use!";
        res.render('auth-views/signup-view.ejs');
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel ({
        fullname: req.body.signupFullName,
        email:req.body.signupEmail,
        encryptedPassword:scrambledPassword
      });
      theUser.save((err) =>{
        if (err) {
          next(err);
          return;
        }
        //redirect to home if registration is SUCCESSFUL
        res.redirect('/');
      });
    }
  );

});

//=================================================================




//LOGIN------------------------------------------------------------

router.get('/login', (req, res, next) => {
  res.render('auth-views/login-view.ejs');
});

router.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/',
    failureRedirect: '/login'
  }
));
//=================================================================




//LOGOUT-----------------------------------------------------------

//=================================================================




//SOCIAL LOGINS----------------------------------------------------

//=================================================================

module.exports = router;
