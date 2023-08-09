const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Test POST /api/issues/{project} only with required parameters', function(done) {
    /*chai
    .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .end
    
      /*.get('/api/issues/apitest')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.string, '10 liters converts to 2.64172 gallons');
        done();
      })*/
  });
  test('Test GET /api/issues/{project}', function(done) {
    /*chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function(err, res) {
        console.log(res.body);
        done();
      })*/
  });
  
});
