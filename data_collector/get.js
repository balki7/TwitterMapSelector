const db = require('../db/mongodb');

let get = {};

let collection = 'tweets';

get.get = (text, bounds, successCallback, failureCallback) => {
    db.connect('local', () => {
        let filter = {
            text : new RegExp(text, 'i')
        };

        if(bounds){
            filter.coordinates = {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon" ,
                        coordinates: [[ [ Number(bounds.lat.min), Number(bounds.lng.min)], [ Number(bounds.lat.max), Number(bounds.lng.min) ]
                            , [ Number(bounds.lat.max), Number(bounds.lng.max) ], [ Number(bounds.lat.min), Number(bounds.lng.max) ]
                            , [ Number(bounds.lat.min), Number(bounds.lng.min) ] ]]
                    }
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
