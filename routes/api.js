/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const ThreadHandler = require('../controllers/threadHandler');
const RepliesHandler = require('../controllers/repliesHandler')

var expect = require('chai').expect;

module.exports = function (app) {

  const threadHandler = new ThreadHandler();
  const repliesHandler = new RepliesHandler();

  app.route('/api/threads/:board')
    .post(threadHandler.newThread)
    .get(threadHandler.threadList)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread);

  app.route('/api/replies/:board')
    .post(repliesHandler.addReply)
    .get(repliesHandler.replyList)
    .put(repliesHandler.reportReply)
    .delete(repliesHandler.deleteReply);

};
