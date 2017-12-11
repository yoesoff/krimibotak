'use strict'

var WebClient = require('@slack/client').WebClient;

var bot_token ='xoxb-284609074786-tNgj7sZEazsLsGT2CmxA9ITW';

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

