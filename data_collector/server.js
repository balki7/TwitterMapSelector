const twitter = require('./twitter');
const db = require('../db/mongodb');

let collection = 'tweets';

let storeTweets = (count) => {
    db.connect('local', () => {
        console.info('Connected to DB');

        twitter.stream((tweet) => {
            db.insert(collection, tweet, () => {
                console.info('Record inserted.');
            });
        });
    }, (err) => {
        console.error('DB connect error', err);
        db.disconnect();
    });
};

storeTweets(10000);


