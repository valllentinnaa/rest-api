const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Login', () => {

    const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@dev.a36yj.mongodb.net/${process.env.MONGO_DEFAULT_DB}`;

    before((done) => {
        mongoose
            .connect(
                MONGODB_URI, {
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                }
            )
            .then(res => {
                const user = new User({
                    email: 'test@test.com',
                    name: 'Tester',
                    password: 'testmest',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                done();
            })
    });

    after((done) => {
        User.deleteMany({}).then(() => {
            return mongoose.disconnect().then(() => {
                done();
            });
        });
    })

    it('should throw an err if accessing DB fails', (done) => {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }

        AuthController.login(req, {}, () => {
        })
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.be.have.property('statusCode', 500);
                done();
            })

        User.findOne.restore();
    })
    it('should send a response with a valid user status for an existing user', (done) => {
        const req = {userId: '5c0f66b979af55031b34728a'};
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => {
        })
            .then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new!');
                done();
            })
    })
});
