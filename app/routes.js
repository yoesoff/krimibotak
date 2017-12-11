'use strict';
module.exports = (app) =>  {
  var slack = require('./slack');
  var bot = require('./bot')

  // Slack App Routes
  app.route('/slack/post-message')
    .get(slack.postMessage);
  app.route('/slack/get-channels')
    .get(slack.getChannels);

  // Slack Bot Route
  app.route('/slack/bot-start').get(bot.start);
  app.route('/slack/bot-disconnect').get(bot.disconnect);
};
