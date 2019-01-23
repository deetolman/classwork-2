require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'a tweet') => {
    return Tweet.create({ handle, text })
  }

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'ryan',
        text: 'hello tweets'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ryan',
          text: 'hello tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds a list of tweets', () => {
    return Promise.all(['ryan', 'another handle'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets')
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('ryan')
      .then(createdTweet => {
        return request(app)
          .get(`/tweets/${createdTweet._id}`)
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ryan',
          text: 'a tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});
