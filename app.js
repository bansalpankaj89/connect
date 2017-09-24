const express = require('express');
const bodyParser = require('body-parser')
const userModel = require('./model/user');


const app = express();
const port = process.env.PORT || 3000;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const jsonParser = bodyParser.json();


app.listen(port, function () {
  console.log('app listening on port !',port);
})


app.get('/api/connect/', function (req, res,next) {
  console.log('Server is Up testing....');
  res.send('Server is Up testing....')
})

//API to create new User.
	// Expected Body Structure
	// {"name":"pankaj",
	//  "email":"pankaj@coonect.com"}
app.post('/api/connect/user',jsonParser, function (req, res) {
	console.log('Request Body for Create New User API ---> ',req.body);

	var user ={
		name : req.body.name,
		email : req.body.email
	} 

	userModel.createUser(user)
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})


//API to retrieve the friends list for an email address.
app.get('/api/connect/user/:email', function (req, res) {
	console.log('Get User API ---> ' +req.params.email);

	userModel.getUser(req.params.email)
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})


app.get('/api/connect/users', function (req, res) {
	console.log('Get User List API ---> ');

	userModel.getUsers()
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})


//API to create a friend connection between two email addresses
	// Expected Body Structure
	// {
	//   friends:
	//     [
	//       'andy@example.com',
	//       'john@example.com'
	//     ]
	// }

app.put('/api/connect/addfriend',jsonParser, function (req, res) {
	console.log('Request Body for Add Friend API ---> ',req.body);

	var email1 = req.body.friends[0];
	var email2 = req.body.friends[1];

	userModel.addFriend(email1,email2)
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})

//API to subscribe to updates from an email address.
    // Expected Body Structure
	// { "requestor": "lisa@example.com",
	//   "target": "john@example.com"
	// }
app.put('/api/connect/subscribe',jsonParser, function (req, res) {
	console.log('Request Body for Subscribe API ---> ',req.body);

	var subscribe ={
		requestor : req.body.requestor,
		target : req.body.target
	} 

	userModel.subscribeUser(subscribe)
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})

//API to block updates from an email address.
	// Expected Body Structure
	// { "requestor": "lisa@example.com",
	//   "target": "john@example.com"
	// }
app.put('/api/connect/block',jsonParser, function (req, res) {
	console.log('Request Body for Block API ---> ',req.body);

	var block ={
		requestor : req.body.requestor,
		target : req.body.target
	} 

	userModel.blockUser(block)
	.then(function(collection) {
	    res.status(200);
	    res.send(collection);
	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})


module.exports = app;
