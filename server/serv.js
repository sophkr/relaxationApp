(function () {
	"use strict";

	var Express = require('express'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        app = new Express();

	app.use(Express.static(__dirname));
	app.use(bodyParser.urlencoded({ extended: true }));

	mongoose.connect('mongodb://localhost/users');

	var UserSchema = mongoose.Schema({"username": String,"highscore":Number});

	var User = mongoose.model('User', UserSchema);

	app.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
	});
	
	app.get("/getUser", function(req, res, next) {
		User.find(req.query, function(err, user) {
			if (err) {
            console.log("Error:"+err);
				console.log(err);
			} else {
            console.log("User found:"+user);
				res.json(user);
			}
			res.end();
		});
	});

	app.post("/putUser", function (req, res, next) {
        var newUser = new User(req.body);
        newUser.highscore = 0;
		newUser.save(function (error, data) {
			if (error) console.log(error);
		});
        console.log("Saved new user:\t"+newUser);
		res.end();
	});

    app.post("/updateUser", function (req, res, next) {
        var conditions = {"username" : req.body.username};
		var update = {$set : {"highscore" : req.body.highscore}};
		User.update(conditions, update, {multi : false}, function(error, result) {
			if (error) console.log(error);
		});

		res.end();
	});

	app.listen(3000);
	console.log("Server listening on port 3000.");

}());
