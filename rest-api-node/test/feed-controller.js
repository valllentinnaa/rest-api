const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Creating posts', () => {

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

    it('should add a created post to the posts of the creator', (done) => {
        const req = {
            body: {
                title: 'Title 1',
                content: 'Test Mest',
            },
            file: {
                path: 'test//',
            },
            userId: '5c0f66b979af55031b34728a'
        };

        const res = {
            status: function () {
                return this;
            },
            json: function () {
            }
        }

        FeedController.createPost(req, res, () => {
        })
            .then(savedUser => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
                done();
            }).catch(done)
    })
});