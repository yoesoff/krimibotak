'use strict'

var firebase = require('firebase'); // Has been initialized
var database = firebase.database();
var now = new Date().toISOString().slice(0,10); 
var ref = database.ref("thanks/" + now); // Max 5 a day

var notify = (rtm, channel, sender, receivers) => {
    for (const r of receivers) {
        if (r == "" || typeof r == 'undefined') {
            continue;
        }

        var ref_get = database.ref('total/' + r + '/total_get');

        ref_get.once('value', function(snapshot) {
            if (snapshot.exists()) {
                let msg_thank = `<@${r}> receives 1 point from <@${sender}>. He now has ${snapshot.val()} points.`;     
                rtm.sendMessage(msg_thank, channel); // Send direct message is not possible until user chat the bot first
                ref_get.set(parseInt(snapshot.val())+1);  // Increment      
            } 
        });

    }   
}

// Total received
var totalThankGet = (user_id) =>  {
    console.log("User Id : " + user_id);
    var ref_get = database.ref('total/' + user_id + '/total_get');
    ref_get.once('value', function(snapshot) {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            ref_get.set(parseInt(snapshot.val())+1);  // Increment      
        } else {
            ref_get.set(1);  // first node init
        }
    });
}

// Total given
var totalThankGiven = (user_id) => {
    console.log("User Id : " + user_id);
    var ref_get = database.ref('total/' + user_id + '/total_given');
    ref_get.once('value', function(snapshot) {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            ref_get.set(parseInt(snapshot.val())+1);  // Increment      
        } else {
            ref_get.set(1);  // first node init
        }
    });
}

exports.thanks_set = (rtm, channel, sender, receivers) => {
    // Adding new record in non-empty /tests is considered as update, set / create will destroy whole node records
    console.log("Message contains thank from", sender);

    var thanks_data = {};
    thanks_data[sender]=receivers;
    
    ref.once('value', function(snapshot) {
       if (snapshot.exists()) {
          var ref_sender = database.ref('thanks/' + now + '/'  + sender);
         
          ref_sender.once('value', function(snapshot) {
              if (snapshot.exists()) {
                 console.log("total given thanks:", snapshot.numChildren());
                 if (snapshot.numChildren() < 5) { 
                     for (var key in receivers) {
                          console.log("Adding new child");
                          ref_sender.push(receivers[key]); // /thanks/sender is there, store the child node
                          totalThankGet(receivers[key]);
                          totalThankGiven(sender);
                          notify(rtm, channel, sender, receivers);
                     }
                 } else {
                    let exceed_msg = "5 karma points exceed!"; 
                     console.log(exceed_msg); // Everyone has 5 karma points to give out per day.
                     rtm.sendMessage(exceed_msg, channel); 
                 }
              } else {
                 for (var key in receivers) {
                     console.log("Set sender and add new child");
                     ref.child(sender).push(receivers[key]); // /thanks /sender is there, store the child node
                     totalThankGet(receivers[key]);
                     totalThankGiven(sender);
                     notify(rtm, channel, sender, receivers);
                 }
              }
         });
      } else {
          for (var r in receivers) {
              if (r == "" || typeof r == 'undefined') {
                  continue;
              }
              console.log("set thanks node and sender and child")
              ref.child(sender).push(receivers[r]); // /thanks is not there yet 
              totalThankGet(receivers[r]);
              totalThankGiven(sender);
          }
        
          notify(rtm, channel, sender, receivers);
      }      
    });
  
    return thanks_data;
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.key);
        returnArr.push("{@"+ childSnapshot.key +"}");
    });

    return returnArr;
};

exports.leaderboard = () => {
    var promises = ref.once('value', function(snapshot) {
       if (snapshot.exists()) {
           return snapshotToArray(snapshot); 
       }
       return [];
    });

    return promises;
}
