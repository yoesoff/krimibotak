'use strict';
module.exports = function(app) {
  var test = require('../controllers/testController');

  // todoList Routes
  app.route('/tests')
    .get(test.list)
    .post(test.create);


  app.route('/tests/:testId')
    .get(test.read)
    .put(test.update)
    .delete(test.delete);
};
