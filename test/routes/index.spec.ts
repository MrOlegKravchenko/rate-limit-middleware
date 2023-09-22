import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../src/server';
chai.use(chaiHttp);

const expect = chai.expect;

describe('Routes', () => {
  describe('/products', () => {
    it('should return a list of products', (done) => {
      chai.request(server)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('List of products');
          done();
        })
    });
  });

  describe('/taxes', () => {
    it('should return a list of taxes', (done) => {
      chai.request(server)
        .get('/api/taxes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('List of taxes');
          done();
        });
    });
  });
});
