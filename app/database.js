'use strict'

var firebase = require('firebase'); // Has been initialized
var database = firebase.database();
var now = new Date().toISOString().slice(0,10); 
var ref = database.ref("thanks/" + now); // Max 5 a day

exports.thanks_set = (sender, receivers) => {
    // Adding new record in non-empty /tests is considered as update, set / create will destroy whole node records
    console.log("Message contains thank from", sender);

    var thanks_data = {};
    thanks_data[sender]=receivers;
    
    console.log(thanks_data);
    
    ref.once('value', function(snapshot) {
       if (snapshot.exists()) {
         var ref_sender = database.ref('thanks/' + now + '/'  + sender);
         ref_sender.once('value', function(snapshot) {
            if (snapshot.exists()) {
               for (var key in receivers) {
                  console.log("Adding new child");
                  ref_sender.push(receivers[key]); // /thanks/sender is there store the child node
               }
            } else {
               for (var key in receivers) {
                  console.log("Set sender and add new child");
                  ref.child(sender).push(receivers[key]); // /thanks/sender is there store the child node
               }
            }
         });
      } else {
         for (var key in receivers) {
             console.log("set thanks node and sender and child")
             ref.child(sender).push(receivers[key]); // /thanks is not there yet 
         }
      }      
    });
  
    return thanks_data;
}
