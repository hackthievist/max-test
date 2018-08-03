const express = require('express'); //Correction: Wrapped 'express' in quotations
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");

/**
 * Assume that these are error free.
 */
const User = require("./models/user");
const logger = require("./utils/logger");

const mongoDB = process.env.MONGO_URI;

const app = express();

mongoose.connect(
    mongoDB, {
        useMongoClient: true
    }
);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

app.use(bodyParser.json());

// handler to save user
app.get("/save", function (res, req) { //correction: req comes before res in the parameter ordering of the callback function

    //no defined user
    var userOne = {
        name: 'Sobogun Ifeoluwa',
        role: 'Backend Developer'
    };


    const user = new User(userOne);

    user.save(function (err) {
        if (err) {
            res.status(500).send(err);
            logger.log(err);
        }
        //correction: moved the line below into the save function
        res.status(200).send("success");
    });


    //response sent previously and as such the line below cannot be executed.
    return res.json(user);
});

const server = http.createServer(app);

server.listen(80, function () {
    db.on("error", function (error) {
        logger.log(error);
    });
});