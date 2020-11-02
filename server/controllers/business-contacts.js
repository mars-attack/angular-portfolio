/* 
File: controllers/business-contacts.js
Name: Marianne Palmer
Student#: 301122149
Date: Oct 25th 2020
 */

let express = require('express');
let router = express.Router();

//enable jwt
let jwt = require('jsonwebtoken');

// create a reference to Business Contact schema
let BusinessContact = require('../models/business-contact');


module.exports.displayBusinessContactList = (req, res, next)=>{
  // user model required for nav
  BusinessContact.find((err, ContactList) => {
    if(err) 
    {
      console.error(err);
      res.end(err);
    } 
    else 
    {
      res.render('business-contacts/list', {
        title: "Business Contacts", 
        ContactList: ContactList, 
        displayName: req.user ? req.user.displayName : ''});
    }
    // Sorting by contact name alphabetically
  }).sort({contact_name: 1});
}


module.exports.displayAddPage = (req, res, next) => {
  res.render('business-contacts/add', { title: 'Add Business Contact', displayName: req.user ? req.user.displayName : ''});
};


module.exports.processAddPage = (req, res, next) => {
  let newContact = BusinessContact({
    "contact_name": req.body.contact_name,
    "contact_number": req.body.contact_number,
    "email_address": req.body.email_address
  });

  BusinessContact.create(newContact, (err, BusinessContact) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      // refresh the list
      res.redirect('/business-contacts');
    }
  });
};


module.exports.displayUpdatePage = (req, res, next) => {
  let id = req.params.id;
  BusinessContact.findById(id, (err, contactToEdit) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      res.render('business-contacts/update', {title: "Update Business Contact", contact: contactToEdit, displayName: req.user ? req.user.displayName : ''})
    }
  });
};


module.exports.processUpdatePage = (req, res, next) => {
  let id = req.params.id;
  let updatedContact = BusinessContact({
    "_id": id,
    "contact_name": req.body.contact_name,
    "contact_number": req.body.contact_number,
    "email_address": req.body.email_address
  });

  BusinessContact.updateOne({_id: id}, updatedContact, (err) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      res.redirect('/business-contacts');
    }
  });
};


module.exports.processDelete = (req, res, next) => {
  let id = req.params.id;
  BusinessContact.remove({_id: id}, (err) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      res.redirect('/business-contacts');
    }
  });
};