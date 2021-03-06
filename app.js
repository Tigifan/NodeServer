#!/usr/bin/env node
const port = 3000;

var express = require("express"),
    app = express();
var expressSession = require("express-session");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var gallery = require("./gallery.js");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set('trust proxy', 1);

app.use(favicon(__dirname + "/public/images/favicon.png"));
app.use(logger("dev"));
app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true, cookie: { secure: true }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var session;

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/code", function (req, res) {
   res.redirect("https://github.com/Tigifan");
});

// Gallery
app.get("/gallery", function (req, res) {
    res.render("gallery.ejs", {
        files: gallery.listFiles(__dirname + "/public/gallery/"),
    });
});

// IMPRINT & PRIVACY
app.get("/imprint", function (req, res) {
  res.render("imprint.ejs");
});

app.get("/privacy", function (req, res) {
  res.render("privacy.ejs")
});

// SESSIONS
app.get("/login", function (req, res) {
    session = req.session;

    res.render("login.ejs");
});

app.get("/signin", function (req, res) {
    if(!req.body.email) {
        res.redirect("/login");
    }
    session.email = req.body.email;
    res.end("done");
});

app.get("/signedin", function (req, res) {
    res.render("signedin.ejs");
});

app.get('/logout',function(req,res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.use(function (req, res, next) {
    console.log(req.path)
   res.status(404).render("404.ejs", { url: "apollodoener.de" + req.path });
});


// Start server
app.listen(port, function () {
  console.log("Started on port " + port + "!");
});