/* 
File: controllers/index.js
Name: Marianne Palmer
Student#: 301122149
Date: Oct 25th 2020
 */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let register = require('../models/business-contact');

// create the user model instance
let userModel = require('../models/user');
let User = userModel.Model; // alias


module.exports.displayHomePage = (req, res, next) => {
  res.render('index', { title: 'Home', heading: 'Marianne Palmer', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
  res.render('index', { title: 'About', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayProjectsPage = (req, res, next) => {
  res.render('index', { title: 'Projects', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayServicesPage = (req, res, next) => {
  res.render('index', { title: 'Services', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayContactPage = (req, res, next) => {
  res.render('contact', { title: 'Contact', displayName: req.user ? req.user.displayName : ''});
}

// Authentication Section

module.exports.displayLoginPage = (req, res, next) => {
  // check if the user us already logged in

  if(!req.user)
  {
    res.render('auth/login',
    {
      title: "Login",
      messages: req.flash('loginMessage'), 
      displayName: req.user ? req.user.displayName : ''
    });
  }
  else
  {
    return res.redirect('/'); // if user is logged in and clicks login
  }
}

module.exports.processLoginPage = (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) =>
  {
    // if server error
    if(err)
    {
      console.log(err);
      return next(err);
    }
    
    // if not a user, redirect to login
    if(!user)
    {
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }

    
    req.login(user, (err) => {
      // if server error, pass to next middleware
      if(err)
      {
        console.log(err);
        return next(err);
      }
      else
      {
        res.redirect('/business-contacts') // login success
      }
    });

  })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
  // check is if user is not already logged in
  if(!req.user)
  {
    res.render('auth/register',
    {
      title: "Register",
      messages: req.flash('resisterMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  }
  else
  {
    return res.redirect('/');
  }
}

module.exports.processRegisterPage = (req, res, next) => {
  // instantiate a user object
  let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
    // check for errors and if user already exists
    if(err)
    {
      console.log("Error: Inserting new user");
      if(err.name == "UserExistsError")
      {
        req.flash('registerMessage', 'Registration Error: an error occurred');
        console.log('Registration Error: user already exists');
      }
      
      return res.render('auth/register',
      {
        title: "Register",
        messages: req.flash('resisterMessage', 'Registration Error'),
        displayName: req.user ? req.user.displayName : ''
      });
    }
    else //no error exists and registration success
    {
      //redirect and authenticate user
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/business-contacts')
      });
    }
  });
}

module.exports.performLogout = (req, res, next) => {
  req.logout();
  res.redirect('/');
}