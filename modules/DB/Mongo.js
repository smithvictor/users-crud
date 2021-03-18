const mongoose = require('mongoose');
const uri = "mongodb+srv://node:polopo123@cluster0.irl2x.mongodb.net/db?retryWrites=true&w=majority";
const DB = "db";

class Mongo{
    static connect(callback){
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        const db = mongoose.connection;
        db.on('error', function(err){
            console.log(err);
            callback(false);
        });
        db.once('open', function() {
            callback(true);
        });
    }
}

module.exports = Mongo;



