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

//storeTweets('Atatürk', 10000);
//storeTweets('Türkiye', 10000);
//storeTweets('music', 10000);

//storeTweets('tesla', 10000);
//storeTweets('spacex', 10000);
//storeTweets('İstanbul', 10000);

storeTweets('Cumhuriyet', 10000);
//storeTweets('Balkı', 10000);
//storeTweets('izmir', 10000);
//storeTweets('teb', 10000);
//storeTweets('ekonomi', 10000);
//storeTweets('hürriyet', 10000);

