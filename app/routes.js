'use strict';
module.exports = (app) =>  {
  var slack = require('./slack.js');

  // todoList Routes
  app.route('/slack/post-message')
    .get(slack.postMessage);
};
