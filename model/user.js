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
    followerList: [{
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
                console.log('err',err);
                return reject(err);
            }else{
            return resolve(result.friendList);
            }
        })
    });
}

function getFollowers(email) {
    console.log("DB User Email ---> "+email);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email': email}).exec(    
        function(err, result) {
            if(err){
                console.log('err',err);
                return reject(err);
            }else{
            return resolve(result.followerList);
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


function removeFriend(requestor,target) {
        return new Promise(function (resolve, reject) {
        userModel.update({ email: requestor }, { "$pull": { "friendList": { "email": target } }}, { safe: true, multi:true },
         function(err, result) {
            if(err)
                return reject(err);
            return resolve(result);
        });
    });
}

//{friendList:{$elemMatch:{email:target}}}

function checkUser(requestor,target) {
    console.log("DB checkUser ---> ",requestor,target);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email':requestor,'friendList.email': target}).exec(    
        function(err, result) {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    });
}

function checkBlock(requestor,target) {
    console.log("DB checkBlock ---> ",requestor,target);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email':requestor,'blockList.email': target}).exec(    
        function(err, result) {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    });
}

function checkSubscribe(requestor,target) {
    console.log("DB checkSubscribe ---> ",requestor,target);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email':requestor,'subscribeList.email': target}).exec(    
        function(err, result) {
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
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


function followUser(subscribe){
        console.log("DB follow Friends ---> ",subscribe);
        var value = {email: subscribe.requestor};

        return new Promise(function (resolve, reject) {
            userModel.findOneAndUpdate({email: subscribe.target}, {$push:{followerList:value}},{safe: true, upsert: true,new: true},
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

function mutualFriend(email) {
    console.log("DB User Email ---> "+email);
    return new Promise(function (resolve, reject) {
        userModel.findOne({'email': email}).exec(    
        function(err, result) {
            if(err){
                return reject(err);
            }
            return resolve(result.friendList);
        })
    });
}




module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.createUser = createUser;
module.exports.addFriend = addFriend;
module.exports.subscribeUser = subscribeUser;
module.exports.followUser = followUser;
module.exports.blockUser = blockUser;
module.exports.mutualFriend = mutualFriend;
module.exports.checkUser = checkUser;
module.exports.checkBlock = checkBlock;
module.exports.checkSubscribe = checkSubscribe;
module.exports.removeFriend = removeFriend;
module.exports.getFollowers = getFollowers;






