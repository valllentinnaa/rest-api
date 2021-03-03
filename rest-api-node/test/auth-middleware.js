const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

it('should throw an err if there is no authorization header', () => {
const req = {
    get: function() {
        return null
    }
}

expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
})

it('should throw an err if the authorization header is only one string', () => {
    const req = {
        get: function() {
            return 'Bearer'
        }
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
})

it('should throw an err if the token is not verified', () => {
    const req = {
        get: function() {
            return 'Bearer xyz'
        }
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
})

it('should yield a userId after decoding the token', () => {
    const req = {
        get: function() {
            return 'Bearer xyz'
        }
    }

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({userId: 'abc'});
    authMiddleware( req, {}, () => {})
    expect(jwt.verify.called).to.be.true;
    expect(req).to.have.property('userId', 'abc');
    jwt.verify.restore();
})