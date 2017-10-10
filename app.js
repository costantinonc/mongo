var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

// Use morgan and body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get("/scrape", function (req, res) {

    request("http://www.echojs.com/", function (error, response, html) {

        var $ = cheerio.load(html);

        $("article h2").each(function (i, element) {

            var result = {};


            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");


            var entry = new Article(result);


            entry.save(function (err, doc) {

                if (err) {
                    console.log(err);
                }

                else {
                    console.log(doc);
                }
            });

        });
    });
    res.send("Scrape Complete");
});