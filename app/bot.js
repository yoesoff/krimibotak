'use strict';

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

var bot_token = 'xoxb-284609074786-xMWN3zErYfdwl1CWqontyDm7';

var rtm = new RtmClient(bot_token);

let channel;

exports.start = (req, res) => {
    // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='general') { channel = c.id }
      }
      console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    });

    console.log(channel);

    if (channel) {
        // you need to wait for the client to fully connect before you can send messages
        rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
            rtm.sendMessage("Hello from KrimiBot(ak)!, Bot is currently connected.", channel);
        });

        // Receiving message
        rtm.on(CLIENT_EVENTS.MESSAGE, function handleRtmMessage(message) {
            console.log('Message:', message); //this is no doubt the lamest possible message handler, but you get the idea
        });

        rtm.start();
        
        res.json({message: "Started"});
    } else {
      console.log('Please invite bot to the channel!');
      res.json({message: "Bot does not having a channel "});
    }
}

exports.disconnect = (req, res) => {
    rtm.disconnect();
    res.json({message: "Disconnected"})
}
