const db = require('../db/mongodb');

let get = {};

let collection = 'tweets';

get.get = (text, bounds, successCallback, failureCallback) => {
    db.connect('local', () => {
        let filter = {
            text : new RegExp(text, 'i')
        };

        if(bounds){
            console.log([ Number(bounds.lng.min), Number(bounds.lat.min) ], [ Number(bounds.lng.max), Number(bounds.lat.max) ]);
            filter.geo = {
                $geoWithin: {
                    $box: [
                            [ Number(bounds.lng.min), Number(bounds.lat.min) ], [ Number(bounds.lng.max), Number(bounds.lat.max) ]
                        ]
                }
            };
        }

        db.find(collection, filter, (err, result) => {
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
