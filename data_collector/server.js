const twitter = require('./twitter');
const db = require('../db/mongodb');

let collection = 'tweets';

let storeTweets = (keyword, count) => {
    db.connect('local', () => {
        console.info('Connected to DB');

        twitter.search(keyword, count, (tweets) => {
            if (tweets && tweets.length > 0) {
                db.bulkInsert(collection, tweets, () => {
                    console.info('Record inserted.\nCount : ' + tweets.length);
                    db.disconnect();
                });
            }
            else {
                console.info("Finished...\nNo records.");
            }
        });
    }, (err) => {
        console.error('DB connect error', err);
    });
};

storeTweets('%tesla', 10000);

