'use strict'

var WebClient = require('@slack/client').WebClient;

var global =  require('../global');
var bot_token = global.bot_token();

var web = new WebClient(bot_token);

exports.postMessage = (req, res) => {
    web.chat.postMessage('general', 'Hello there!', function(err, slack_res) {
        if (err) {
            console.log('Error:', err);
            res.json( {error: err} );
        } else {
            console.log('Message sent: ', slack_res);
            res.json( {message: slack_res.message.text} );
        }
    });
}

exports.getChannels = (req, res) => {
    web.channels.list(function(err, info) {
        if (err) {
             console.log('Error:', err);
             res.json( {error: err} );
        } else {
            res.json( {channels: info.channels} );     
        }
    });
}
