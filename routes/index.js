var express = require('express');
var router = express.Router();

var User = require("../models/user");
var Image = require("../models/images");
var config = require("../config");
var passport = require("passport");

var localStrategy = require("passport-local").Strategy;
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

//set to jsonwebtoken
var token;

mongoose.connect(config.url, function(err,db){
    if(err){
        return console.log('failed to connect to database', err);
    }
    console.log('connected to database');
});

router.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));

router.get("/user", function(req,res){
    Image.find(function(err, images){
        if(err){
            return console.log('no images found', err);
        }
        res.json(images);
    });
});

router.post("/register",function(req,res){
    User.register(new User({ username: req.body.username }), req.body.password, function(err,account){
        if(err){
            return console.log(err);
        }
        console.log('registered user', account.username);
        res.redirect("/");
    });
});

router.get("/user/:user", function(req,res){
    var user = req.params.user;
    var query = Image.find({ added_by:user });
    
    query.exec(function(err, images){
        if(err){
            return console.log('could not find images by this user', err);
        }
        res.json(images);
    });
});

router.post("/login", passport.authenticate('local', {session:false, failureRedirect:"/"}), function(req,res){
    token = jwt.sign({user:req.user.username}, config.secret);
    console.log("successful log in", req.user.username);
    res.redirect("/#/user/home");
});

/* Protected Routes */
var decoded;
router.use(function(req,res,next){
    if(token !== undefined){
        decoded = jwt.verify(token, config.secret);
        next();
    } else {
        res.redirect("/");
    }
});

router.get("/images", function(req,res){
    var query = Image.find({ added_by:decoded.user });
    
    query.exec(function(err, images){
        if(err){
            return console.log('could not find any images by this user', err);
        }
        console.log(decoded);
        res.json(images);
    });
});

router.post("/images", function(req,res){
    
    var image = new Image(req.body);
    image.added_by = decoded.user;
    
    image.save(function(err, image){
        if(err){
            return console.log('could not save image', err);
        }
        console.log(image.image);
        res.json(image);
    });
});

router.delete("/delete/:id", function(req,res){
    var id = req.params.id;
    var query = Image.findByIdAndRemove(id);
    
    query.exec(function(err, img){
        if(err){
            return console.log("could not find image", err);
        }
        console.log(img);
        res.json(img);
    });
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports = router;
