const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Test POST /api/issues/{project} only with required parameters', function(done) {
    let projectName = "apitest";
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
        assert.equal(res.body.issue_title, expected.issue_title);
        assert.equal(res.body.issue_text, expected.issue_text);
        assert.equal(res.body.created_by, expected.created_by)
        done()
      })
    
  });
  test('Test POST /api/issues/{project} with all parameters', function(done) {
    let projectName = "apitest";
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
  test('Test POST /api/issues/{project} without required parameters', function(done) {
    let projectName = "apitest";
    let expected = {
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
  test('Test GET /api/issues/{project} with just a project name', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function(err, res) {
        assert.equal(res.status, '200')
        done();
      })
  });
  test('Test GET /api/issues/{project} with query', function(done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true')
      .end(function(err, res) {
        assert.equal(res.status, '200')
        done();
      })
  });
  
});
