'use strict';

var today = new Date();
var ymdhis =  today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var firebase =  require('./database');
var global =  require('../global');
var bot_token = global.bot_token();

var rtm = new RtmClient(bot_token);

let bot;
let channels=[];
let cgeneral;

var deleteIndex = function( arr, value ){
    var i = arr.length;
    while( i-- ) if(arr[i] === value ) arr.splice(i,1);
}

var getUsersFromMessage = (message) =>  {
    if (typeof message == 'undefined' || message == '') {
      return;
    }

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

    var channel = msg.channel;
    //console.log(channels.indexOf(channel));
  
   /* if (channels.indexOf(channel) < 0 ) {*/
        //console.log("Bot does not present in this Channel");
    /*}*/

    var sender = msg.user;
    var receivers = getUsersFromMessage(msg.text);
    var strlower_msg = msg.text.toLowerCase();
    
    if ( strlower_msg.indexOf('thank')>=0 ) {
        if (receivers.length <= 0) {
            rtm.sendMessage("Whom do you want to thank?", channel); 
            return;
        }
        
        firebase.thanks_set(rtm, channel, sender, receivers);

    } else if (strlower_msg.indexOf('leaderboard')>=0) {
    
        // check wheather bot being called or not
        if (receivers && receivers.indexOf(bot) >=0) {
            console.log("Bot mentioned to check leader board");
            return;
        }
       
    } else if (strlower_msg.indexOf('karma')>=0 && channel.charAt(0) == 'D' ) { // Check DM that contain leaderboard 
        
        // C, it's a public channel
        // D, it's a DM with the user
        // G, it's either a private channel or multi-person DM

        // DM Only 
        firebase.karma(rtm, channel, sender);
            
    } else {
        // To test the bot
        /*if (msg.text.indexOf("hello")) {*/
            //rtm.sendMessage("Hello <@" + msg.user + ">!", channel);
        //} else {
            //console.log("Does not contain thank or other recognized text");
        /*}*/
    }
}

exports.start = (req, res) => {
    if (rtm.connected) {
        let err_msg = "Connection has been established and still working properly! <" + ymdhis + ">";
        rtm.sendMessage(err_msg, cgeneral);
        res.json({message: err_msg});
        console.log(err_msg);
        return;
    }
    
    // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      
        bot = rtmStartData.self.id ; // List of channels
        console.log("Bot: " . bot);
        console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
        for (const c of rtmStartData.channels) {
            if (c.is_member) { 

                if (c.name ==='general') {
                    cgeneral = c.id; // General is default channel
                }

                channels.push(c.id); // All channels with bot in
                console.log("Joining channel " + c.name + "("+ c.id +")"); // List of channels
            }
        }
    });

    // Join channel https://api.slack.com/events
    rtm.on(RTM_EVENTS.CHANNEL_JOINED, (data) => {
        console.log("Invited to the new Channel " + data.channel.name + " (" +  data.channel.id + ")" );
        channels.push(data.channel.id);        
    });

    // Left channel
    rtm.on(RTM_EVENTS.CHANNEL_LEFT, (data) => {
        console.log(data);
        console.log("Bot Left Channel  " + data.channel + " (" +  data.type + ")" );
        deleteIndex(channels, data.channel.id);        
    });

    // Deleted channel 
    rtm.on(RTM_EVENTS.CHANNEL_DELETED, (data) => {
        console.log(data);
        console.log("Bot Left Channel  " + data.channel + " (" +  data.type + ") due to removed channel" );
        deleteIndex(channels, data.channel.id);        
    });


    // you need to wait for the client to fully connect before you can send messages
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
        let greeting= "Hello, KrimiBot daemon is running now! <" + ymdhis + ">";
        for (const c of channels) {
            rtm.sendMessage(greeting, c);
            console.log(greeting);
        }
    });

    // Get Message
    rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
        messageProcessor(message);
    });

    rtm.start();

    res.json({message: "Started"});
    return;
}

exports.disconnect = (req, res) => {
    rtm.disconnect();
    res.json({message: "Disconnected"})
}
