

var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var secret = 'this is the secret secret secret 12356';



var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/auth';

mongo.MongoClient.connect(mongoUri, function(err, db) {
    if (err) {
        console.log("Error on connecting to AUTH: " + err);

    } else if(!err) {
        console.log("Connected to 'Auth' database");
        db.collection('auth', {strict: true}, function (err, collection) {
            if (err) {
                console.log("The 'Auth' collection doesn't exist. Creating it with sample data...");

                var user = [
                    {
                        mail: "unique@user.id",
                        password: "1234"
                    }
                ];

                db.collection('auth', function (err, collection) {
                    collection.insert(user, {safe: true}, function (err, result) {
                    });
                });
            }

        });
    } else{
        console.log("??????? on connecting to AUTH: ");
    }
});


exports.addUser = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
		    var user = req.body;
		    console.log('Adding User: ' + JSON.stringify(user)); // should be removed before production!!!!!!!!
		    db.collection('auth', function(err, collection) {
		        collection.insert(user, {safe:true}, function(err, result) {
		            if (err) {
		                res.send({'error':'An error has occurred'});
		            } else {
		                var token = jwt.sign(user, secret, { expiresInMinutes: 60 });
						console.log('generating token: ' + JSON.stringify(token));

						res.json({ token: token });
		            }
		        });
		    });
		}
	});    
};

exports.checkUser = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
		    var user = req.body;
		    console.log('Checking User: ' + JSON.stringify(user)); // should be removed before production!!!!!!!!
		    db.collection('auth', function(err, collection) {
			        collection.find({mail: user.mail, password: user.password}).toArray(function(err, result) {
		            	if (err) {
		                	res.send({'error':'An error has occurred'});
						} else if (!!result[0]){
		                	console.log('user found: ' + JSON.stringify(result[0]));
							
							// generate token here
							var token = jwt.sign(user, secret, { expiresInMinutes: 60 });
							console.log('generating token: ' + JSON.stringify(token));

							res.json({ token: token });
							
						} else{
							console.log('user not found!');
							res.send({'error':'User Not Found. Wrong Email or Password.'});
						}
					});
		        });
		    }
	});    
};


exports.findAll = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
	        console.log("Connected to 'Auth' database");
	        db.collection('auth', {strict:true}, function(err, collection) {
	        	collection.find().toArray(function(err, items) {
	            	res.send(items);
				});
			});
		}
	});
};
