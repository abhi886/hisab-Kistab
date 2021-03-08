const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/index');

chai.use(chaiHttp);
chai.should();

describe('Index Test', () => {
  // const dummyResponse = 'hello world';

  it('hello world', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        // res.text.should.equal('hello world');
        done();
      });
  });
});
