const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require("../models/user-model.js");
const passport = require('passport');
const router = express.Router();

//REGISTRATION-----------------------------------------------------

router.get ('/signup', (req, res, next) => {
  if(req.user){
    res.redirect('/login');
  }
  else{
    res.render('auth-views/signup-view.ejs');
  }
});

router.post('/signup', (req, res, next) => {
  if( req.body.signupEmail === '' || req.body.signupPassword === ''){
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
        firstname: req.body.signupFirstName,
        lastname: req.body.signupLastName,
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

router.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/my-notes',
    failureRedirect: '/signup'
  }
));
//=================================================================




//LOGOUT-----------------------------------------------------------

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/signup');
});

//=================================================================


module.exports = router;
