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

suite('Functional Tests', function() {

  let thread_id;
  let thread_id1;
  let reply_id;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('create new thread', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({text: 'test text', delete_password: 'test password'})
        .end(function (err, res) {
          assert.equal(res.status, 200)
        });
        chai.request(server)
        .send({text: 'test text', delete_password: 'test password'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done()
        })
      })

    });
    
    suite('GET', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
