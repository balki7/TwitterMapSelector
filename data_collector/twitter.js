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

twitter.search = (filter, allCount, callback) => {
    let returnList = new Array();

    let client = twitter.authenticate();

    let getTweets = (filter, maxId) => {
        let options = {
            q: filter,
            result_type: 'recent',
            //lang: 'tr',
            count: 100,
            include_entities:true
        };

        if(maxId){
            options.max_id = maxId;
        }

        client.get('search/tweets', options, (error, tweets, response) => {
            if (error) {
                console.error(error.message || error[0].message);
                return callback(returnList);
            }

            let statuses = tweets.statuses;
            if (statuses && statuses.length > 0) {
                for (let status of statuses) {
                    if(status.geo){
                        returnList.push(status);
                        console.info(status.text);
                    }
                }

                if (returnList.length < allCount) {
                    getTweets(filter, statuses[statuses.length-1].id);
                }
                else {
                    return callback(returnList);
                }
            }
            else {
                return callback(returnList);
            }
        });
    };

    getTweets(filter);
};

twitter.stream = (callback) => {
    let client = twitter.authenticate();

    let getTweets = () => {
        let stream = client.stream('statuses/filter', {track: '.'});
        stream.on('data', (tweet) => {
            if(tweet && tweet.geo){
                console.info(tweet.text + '\t' + tweet.geo);
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
