/* 
File: routes/business-contacts.js
Name: Marianne Palmer
Student#: 301122149
Date: Oct 25th 2020
 */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');

let businessContactController = require('../controllers/business-contacts');

// Helper function for gaurd purposes

function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated())
  {
    return res.redirect('/login');
  }
  next();
}


// GET Route for displaying business contact list

router.get('/', requireAuth, businessContactController.displayBusinessContactList);

// GET Route for displaying the Add Page - Create operation 
router.get('/add', requireAuth, businessContactController.displayAddPage);

// GET Route for processing the Add Page - Create operation 
router.post('/add', requireAuth, businessContactController.processAddPage);


/* GET Route for displaying the Edit Page - UPDATE operation */
router.get('/update/:id', requireAuth, businessContactController.displayUpdatePage);

/* GET Route for processing the Edit Page - UPDATE operation */
router.post('/update/:id', requireAuth, businessContactController.processUpdatePage);

// GET Route to perform the Deletion - DELETE operation
router.get('/delete/:id', requireAuth, businessContactController.processDelete);

module.exports = router;