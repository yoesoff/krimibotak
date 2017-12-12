'use strict';
var firebase = require('firebase'); // Has been initialize in app.js
var database = firebase.database();
var ref = database.ref("tests");

exports.list = (req, res) => {
    ref.once("value", function(snapshot) {
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

}

exports.create = (req, res) => {
    // Adding new record in non-empty /tests is considered as update, set / create will destroy whole node records
    ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
         ref.update(req.body); 
         console.log('exist');
      } else {
        console.log('empty');
         ref.set(req.body); 
      }
    });
     
    res.json(req.body);
}

exports.read = (req, res) => {
    ref.child(req.params.testId).once("value", function(snapshot) {
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

}

exports.update = (req, res) => {
    ref.child(req.params.testId).update(req.body);   
    res.json(req.body);
}

exports.delete = (req, res) => {
    ref.child(req.params.testId).remove();
    res.json({Message: "Deleted"});
}
