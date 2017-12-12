'use strict'

var firebase = require('firebase'); // Has been initialized
var database = firebase.database();
var ref = database.ref("thanks");

exports.thanks_set = () => {
    // Adding new record in non-empty /tests is considered as update, set / create will destroy whole node records
    
    var thanks_data = "";
    ref.once('value', function(snapshot) {
        if (snapshot.exists()) {
           ref.update(thanks_data); 
        } else {
           ref.set(thanks_data); 
        }
    });
     
    
  
    return "thanks";

}
