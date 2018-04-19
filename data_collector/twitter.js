const Twitter = require('twitter');

let twitter = {};

twitter.authenticate = () => {
    let client = new Twitter({
        consumer_key: 'nQMrvAYgERuArDpBHun8RdYlz',
        consumer_secret: 'aLBoklrpHBA7LffEtGwFtxuAyDgfSrkPdXw4V7BR6B4gS2jqqt',
        access_token_key: '967433015872905216-iRwMHUYxchLVEAvjTYVRULqunf7p0h2',
        access_token_secret: '3W9BCuxj7qXoZOOR1JpCBVBIyZLJ0MchgGjgWCSCMTP9K'
    });
    return client;
};

twitter.stream = (callback) => {
    let client = twitter.authenticate();

    let getTweets = () => {
        let stream = client.stream('statuses/filter', {track: '.'});
        stream.on('data', (tweet) => {
            if(tweet && tweet.geo){
                console.info(tweet.text + '\t' + JSON.stringify(tweet.geo));
                callback(tweet);
            }
        });

        stream.on('error', (error) => {
            console.error(error);
        });
    };

    getTweets();
};

module.exports = twitter;
