/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  let thread_id;
  let thread_id1;
  let reply_id;

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {

      test('create new thread', function (done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({ text: 'test text', delete_password: 'test password' })
          .end(function (err, res) {
            assert.equal(res.status, 200)
          });
        chai.request(server)
          .send({ text: 'test text', delete_password: 'test password' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done()
          })
      })

    });

    suite('GET', function () {

      test('most recent 10 threads with most recent 3 replies', function (done) {
        chai.request(server)
          .get('/api/thread/test')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isBelow(res.body.length, 11);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'replies');
            assert.notProperty(res.body[0], 'reported');
            assert.notProperty(res.body[0], 'delete_password');
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            thread_id = res.body[0]._id;
            thread_id1 = res.body[1]._id;
            done();
          })
      })

    });

    suite('DELETE', function () {

      test('delete a thread, success', function (done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({ thread_id: thread_id, delete_password: 'test password' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });

      test('delete a thread with incorrect password', function (done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({ thread_id: thread_id, delete_password: 'wrong password' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          })
      })

    });

    suite('PUT', function () {

      test('report a thread, change reported value to true', function (done) {
        chai.request(server)
          .put('api/threads/test')
          .send({ thread_id: thread_id1 })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
      })

    });


  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    suite('POST', function () {

      test('reply to a thread', function (done) {
        chai.request(server)
          .post('/api/replies/test')
          .send({ thread_id: thread_id1, text: 'reply', delete_password: 'password' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          })
      })

    });

    suite('GET', function () {
      test('thread with entire replies', function (done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({ thread_id: thread_id1 })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'bimped_on');
            assert.property(res.body, 'replies');
            assert.notProperty(res.body, 'delete_password');
            assert.notProperty(res.body, 'reported');
            assert.isArray(res.body.replies);
            assert.notProperty(res.body.replies[0], 'delete_password');
            assert.notProperty(res.body.replies[0], 'reported');
            assert.equal(res.body.replies[0].text, 'reply');
            reply_id = res.bodt.replies[0]._id;
            done();
          })
      })

    });

    suite('PUT', function () {

      test('report reply, change reported reply value to true', function (done) {
        chai.request(server)
          .put('api/replies/test')
          .send({ thread_id: thread_id1, reply_id: reply_id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
      })

    });

    suite('DELETE', function () {

      test('delete reply, success', function (done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({ thread_id: thread_id1, reply_id: reply_id, delete_password: 'password' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });

      test('delete reply with incorrect password', function (done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({ thread_id: thread_id1, reply_id: reply_id, delete_password: 'wrong' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          })
      })

    });

  });

});
