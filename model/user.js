const mongoose = require('mongoose');
mongoose.connect('mongodb://pankaj:pankaj123@ds040167.mlab.com:40167/connectdb');

var userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, 
    friendList: [{
        email: { type: String, required: true }
    }],
    subscribeList: [{
        email: { type: String, required: true }
    }],
    blockList: [{
        email: { type: String, required: true }
    }],
    createDt: { type: Date, default: Date.now }
});

var userModel = mongoose.model('users', userSchema);



function createUser(user){
        console.log("DB Create User ---> ",user);
        return new Promise(function (resolve, reject) {
            userModel.create(user, function(err, data) {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            }).catch(function (err) {
               return reject(err);
            });
}

function getUser(email) {
    console.log("DB User Email ---> "+email);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email': email}).exec(    
        function(err, result) {
            if(err){
                console.log("err ---> "+err);
                return reject(err);
            }else{
                console.log("result ---> "+result);
            return resolve(result);
            }
        })
    });
}

function getUsers() {
    return new Promise(function (resolve, reject) {
        userModel.find({}, function (err, collection) {
            if(err)
                return reject(err);
            return resolve(collection);
        });
    });
}

function addFriend(email1,email2){
        console.log("DB Add Friends ---> ",email1,email2);
        var value1 = {email: email2};
        var value2 = {email: email1};

        return new Promise(function (resolve, reject) {
            userModel.findOneAndUpdate({email: email1}, {$push:{friendList:value1}},{safe: true, upsert: true,new: true},
                function(err, data) {
                    if(err){
                        return reject(err);
                    }
                    //return resolve(data);
                   userModel.findOneAndUpdate({email: email2}, {$push:{friendList:value2}},{safe: true, upsert: true,new: true},
                        function(err, data) {
                            if(err){
                                return reject(err);
                            }
                            return resolve(data);
                        });
                });
            }).catch(function (err) {
               return reject(err);
            });
}

function subscribeUser(subscribe){
        console.log("DB Subscribe Friends ---> ",subscribe);
        var value = {email: subscribe.target};

        return new Promise(function (resolve, reject) {
            userModel.findOneAndUpdate({email: subscribe.requestor}, {$push:{subscribeList:value}},{safe: true, upsert: true,new: true},
                function(err, data) {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            }).catch(function (err) {
               return reject(err);
            });
}

function blockUser(block){
        console.log("DB block Friends ---> ",block);
        var value = {email: block.target};

        return new Promise(function (resolve, reject) {
            userModel.findOneAndUpdate({email: block.requestor}, {$push:{blockList:value}},{safe: true, upsert: true},
                function(err, data) {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            }).catch(function (err) {
               return reject(err);
            });
}


module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.createUser = createUser;
module.exports.addFriend = addFriend;
module.exports.subscribeUser = subscribeUser;
module.exports.blockUser = blockUser;




