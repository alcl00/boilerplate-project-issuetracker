const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectId = require('mongoose').Types.ObjectId;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let id1, id2;

  suite('Test POST /api/issues/{project}', function() {
    test('Only required parameters', function(done) {
      let projectName = "unit_test";
      let expected = {
        issue_title: "title",
        issue_text: "text",
        created_by: "author"
      }
      chai
      .request(server)
        .keepOpen()
        .post(`/api/issues/${projectName}`)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(expected)
        .end(function(err, res) {
          id1 = res.body._id
          console.log(typeof id1)
          assert.equal(res.body.issue_title, expected.issue_title);
          assert.equal(res.body.issue_text, expected.issue_text);
          assert.equal(res.body.created_by, expected.created_by)
          done()
        })
      
    });
    test('Every field', function(done) {
      let projectName = "unit_test";
      let expected = {
        issue_title: 'title',
        issue_text: 'text',
        created_by: 'alex',
        assigned_to: 'alex',
        status_text: 'status'
      }
      
      chai
      .request(server)
        .keepOpen()
        .post(`/api/issues/${projectName}`)
        .send(expected)
        .set("content-type", "application/x-www-form-urlencoded")
        .end(function(err, res) {
          id2 = res.body._id
          assert.equal(res.body.issue_title, expected.issue_title);
          assert.equal(res.body.issue_text, expected.issue_text);
          assert.equal(res.body.created_by, expected.created_by);
          assert.equal(res.body.assigned_to, expected.assigned_to);    
          assert.equal(res.body.status_text, expected.status_text);    
          assert.isNotNull(res.body.created_on);
          assert.isNotNull(res.body.updated_on)
          done()
        })
        
    });
    test('Without required parameters', function(done) {
      let projectName = "unit_test";
      let expected = {
        _id: id1,
        createdOn: new Date()
      }
      chai
      .request(server)
        .keepOpen()
        .post(`/api/issues/${projectName}`)
        .set("content-type", "application/x-www-form-urlencoded")
        .send(expected)
        .end(function(err, res) {
          assert.equal(res.body.error, 'required field(s) missing')
          done()
        })
        
      });

  })

  suite('Test GET /api/issues/{project}', function() {
    test('View all issues for project', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/unit_test')
        .end(function(err, res) {
          assert.equal(res.status, '200')
          assert.notEqual(res.body, {});
          done();
        })
    });
    test('One query', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/unit_test?open=true')
        .end(function(err, res) {
          assert.equal(res.status, '200')
          assert.notEqual(res.body, {});
          done();
        })
    });
    test('Multiple queries', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/unit_test?open=true&issue_title=title')
        .end(function(err, res) {
          assert.equal(res.status, '200')
          assert.notEqual(res.body, {});
          done();
        })
    });
  })

  suite('Test PUT /api/issues/{project}', function() {
    test('One field', function(done) {
      let expected = {
        _id: id1,
        issue_title: "updated_title"
      }
      chai
        .request(server)
        .put('/api/issues/unit_test')
        .send(expected)
        .end(function(err,res){
          assert.equal(res.body.result, 'successfully updated');
          done();
        })
    });
    test('Multiple fields', function(done) {
      let expected = {
        '_id': id2,
        'status_text': "done",
      }
      chai
        .request(server)
        .put('/api/issues/unit_test')
        .send(expected)
        .end(function(err,res){
          assert.equal(res.body.result, 'successfully updated');
          done();
        })
    });
    test('Missing id', function(done) {
      let expected = {
        status_text: "done",
        open: false
      }
      chai
        .request(server)
        .put('/api/issues/unit_test')
        .send(expected)
        .end(function(err,res){
          assert.equal(res.body.error, 'missing _id');
          done();
        })
    })
    test('Empty fields', function(done) {
      chai
        .request(server)
        .put('/api/issues/unit_test')
        .send({
          _id: id1
        })
        .end(function(err,res){
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        })
    })
    test('Invalid id', function(done) {
      invalidId = '123456789012';
      
      chai
        .request(server)
        .put('/api/issues/unit_test')
        .send({
          _id: invalidId,
          "status_text": "done",
          "open": false
        })
        .end(function(err,res){
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, invalidId)
          done();
        })
    })
  })
  suite('Test DELETE /api/issues/{project}', function() {
    test('Successful deletion', function(done) {
      chai
        .request(server)
        .delete('/api/issues/unit_test')
        .send({
          '_id': id1
        })
        .end(function(err, res) {
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, id1);
          done();
        })
    })
    test('Invalid id', function(done) {
      let invalidId = '123456789012';
      chai
        .request(server)
        .delete('/api/issues/unit_test')
        .send({
          '_id': invalidId
        })
        .end(function(err, res) {
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, invalidId);
          done();
        })
    })
    test('No id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/unit_test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        })
    })
  })

});
