const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://pankaj:pankaj123@ds040167.mlab.com:40167/connectdb');
    
    var db = mongoose.connection;
    console.log('connecting.....'+db);
    
    db.on('error', function(error) {
        console.error(error);
    });
    
    db.once('open' , function () {
        console.log('Connect App db opened');
    });
}

