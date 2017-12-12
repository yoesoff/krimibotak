'use strict';

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var firebase =  require('./database');
var global =  require('../global');
var bot_token = global.bot_token();

var rtm = new RtmClient(bot_token);

let channel;

var getUsersFromMessage = (message) =>  {
  message = message.split('<');
  var users = [];
  for (var i = 1; i < message.length; i++) {
      var xstr = message[i].split('>')[0].substring(1);
      users[i] = xstr;
  }
  return users;
}

var messageProcessor = (msg) => { // Input is json
    if ("message" !== msg.type){
        return false;
    }

    console.log('Message Processing:', msg); 

    var channel = msg.channel;
    var sender = msg.user;
    var receivers = getUsersFromMessage(msg.text);
    console.log(receivers);
  
    console.log(firebase.thanks_set(sender, receivers));
}

exports.start = (req, res) => {
    // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      
      //console.log( rtmStartData.channels ); // List of channels

      for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
      }
      console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
      console.log("selected channel: " + channel)
    });

    // you need to wait for the client to fully connect before you can send messages
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
        rtm.sendMessage("Hello, It's Krimi Botak!", channel);
        console.log('Greeting sent to channel');
    });

    // Get Message
    rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
        messageProcessor(message);
    });

    rtm.start();
        
    res.json({message: "Started"});
    
}

exports.disconnect = (req, res) => {
    rtm.disconnect();
    res.json({message: "Disconnected"})
}
