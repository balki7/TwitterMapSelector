const db = require('../db/mongodb');

let get = {};

let collection = 'tweets';

get.get = (filter, successCallback, failureCallback) => {
    db.connect('local', () => {
        db.find(collection, {
            text : new RegExp(filter, 'i')
        }, (err, result) => {
            if(err){
                db.disconnect();
                return failureCallback(err);
            }

            db.disconnect();
            successCallback(result);
        });
    }, failureCallback);
};

module.exports = get;
