const express = require('express');
const bodyParser = require('body-parser')
const userModel = require('./model/user');
const intersection = require('array-intersection');


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
// {
//   email: 'andy@example.com'
// }
app.put('/api/connect/user',jsonParser, function (req, res) {
	console.log('Get User API ---> ' +req.body.email);

    var result ={
		  "success": true,
		  "friends" :[],
		  "count" : 0   
		}

	userModel.getUser(req.body.email)
	.then(function(collection) {
	    collection.forEach(function(value){
		  result.friends.push(value.email);
		});
		result.count = result.friends.length;
	    res.status(200);
	    res.send(result);
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

	const email1 = req.body.friends[0];
	const email2 = req.body.friends[1];

	var result = {
		  "success": false,
		  "detail": "Already a friend"
	};

	userModel.checkUser(email1,email2)
	.then(function(data) {

		if(data == null){
			userModel.addFriend(email1,email2)
			.then(function(collection) {
				result.success = "true";
			    //result.detail = collection;
			    result.detail = email1 +" and "+ email2 +" are friends now";
			    res.status(200);
			    res.send(result);
			})
			.catch(function (err) {
			    res.status(400);
			    res.send({reason: err.toString()});
			});
		}else{
				res.status(200);
			    res.send(result);
		}
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

	const subscribe ={
		requestor : req.body.requestor,
		target : req.body.target
	} 

	var result = {
		  "success": false,
		  "detail": "Already Subscribed"
	};


	userModel.checkSubscribe(subscribe.requestor,subscribe.target)
	.then(function(data) {
		if(data == null){
			userModel.subscribeUser(subscribe)
			.then(function(data) {
				result.success = "true";
			    result.detail = data;
	    			userModel.followUser(subscribe)
						.then(function(collection) {
						    res.status(200);
						    res.send(result);
						})
						.catch(function (err) {
						    res.status(400);
						    res.send({reason: err.toString()});
						});
			})
			.catch(function (err) {
			    res.status(400);
			    res.send({reason: err.toString()});
			});
		}else{
				res.status(200);
			    res.send(result);
		}
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

	const block ={
		requestor : req.body.requestor,
		target : req.body.target
	} 

	var result = {
		  "success": false,
		  "detail": "Already Blocked"
	};

	userModel.checkBlock(block.requestor,block.target)
	.then(function(data) {
		if(data == null){
			userModel.blockUser(block)
			.then(function(collection) {
					userModel.removeFriend(block.requestor,block.target)
					.then(function(collection) {
						// todo: remove from friend and subscribe list
						result.success = "true";
						result.detail = "Blocked successfully";
					    res.status(200);
					    res.send(result);
					})
					.catch(function (err) {
					    res.status(400);
					    res.send({reason: err.toString()});
					});
			})
			.catch(function (err) {
			    res.status(400);
			    res.send({reason: err.toString()});
			});
		}else{
				res.status(200);
			    res.send(result);
			}
		})
		.catch(function (err) {
		    res.status(400);
		    res.send({reason: err.toString()});
		});	
})

//API  1  to retrieve the common friends list between two email addresses.
	// Expected Body Structure
	// {
	//   friends:
	//     [
	//       'andy@example.com',
	//       'john@example.com'
	//     ]
	// }
app.put('/api/connect/mutualfriend',jsonParser, function (req, res) {
	console.log('Request Body for Mutual Friend API ---> ',req.body);

    var result ={
			  "success": true,
			  "friends" :[],
			  "count" : 0   
			}

 //    var failure ={
	// 	  "success": false,
	// 	  "reason" :""
	// 	}	

	// if(req.body.friends.length != 2 || req.body.friends == undefined){
	// 	 failure.success = false;
	// 	 failure.reason = "Invalid parameters"
	// 	 res.status(200);
	// 	 res.send(failure);
	// }
	
	var email1 = req.body.friends[0];
	var email2 = req.body.friends[1];
	var friendList1 = [];
	var friendList2 = [];
	var common = [];

	userModel.mutualFriend(email1)
	.then(function(collection1) {

		if(collection1 != null){

		    	userModel.mutualFriend(email2)
					.then(function(collection2) {

						if(collection2 != null){
							collection2.forEach(function(value){
							  friendList2.push(value.email);
							});
							collection1.forEach(function(value){
							  friendList1.push(value.email);
							});

							common = intersection(friendList1, friendList2)
							console.log("mutualFriend",common);

							result.friends = common;
							result.count = common.length;

						    res.status(200);
						    res.send(result);
						}else{
							res.status(200);
			                res.send(result);
						}
					})
					.catch(function (err) {
					    res.status(400);
					    res.send({reason: err.toString()});
					});
		}else{
			    res.status(200);
			    res.send(result);
		}			

	})
	.catch(function (err) {
	    res.status(400);
	    res.send({reason: err.toString()});
	});
})	


// API to retrieve all email addresses that can receive updates from an email address.
	// {
	//   "sender":  "john@example.com",
	//   "text": "Hello World! kate@example.com"
	// }
app.put('/api/connect/recieveupdates',jsonParser, function (req, res) {
	console.log('Get Recieve Updates API ---> ');

	var email = req.body.sender;
	var text = req.body.text;
	var textEmail = [];
	var result = {
		  "success": true,
		  "recipients":[]
		}
	var resp = [];
	var resp2 = [];	
	var array3 = []
	var final = []

	textEmail.push(extractEmails(text));
	//result.recipients.push(textEmail[0]);

	console.log('result',textEmail[0]);

			userModel.getUser(req.body.sender)
				.then(function(col) {
				    if(col != null){
							col.forEach(function(value){
							  resp.push(value.email);
							});
					}	

					 array3 = textEmail[0].concat(resp);	

				   		userModel.getFollowers(req.body.sender)
							.then(function(col2) {

								if(col2 != null){
										col2.forEach(function(value){
										  resp2.push(value.email);
										});
								}	
								var final = array3.concat(resp2);	
								result.recipients.push(final);

								 res.status(200);
				  				 res.send(result);

							}).catch(function (err) {
							    res.status(400);
							    res.send({reason: err.toString()});
							});


				})
				.catch(function (err) {
				    res.status(400);
				    res.send({reason: err.toString()});
				});
})


function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        alert("Not a valid e-mail address");
        return false;
    }
}


module.exports = app;
