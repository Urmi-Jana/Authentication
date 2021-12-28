//jshint esversion:6
require('dotenv').config();
const express = require ("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const round = 10;
//const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})

app.get("/register", function(req, res){
    res.render("register")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.post("/register", function(req, res){
    console.log(req.body);
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save(function(err){
        if (err) res.send(err);
        else res.render("secrets");
    });
    
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, result){
        if (err) res.send(err);
        else
        {
            if (result.password === password) res.render("secrets");
            else res.send("Wrong password!!");
        }
    })
})

app.listen(3000, function(req, res){
    console.log("Server started at 3000");
})