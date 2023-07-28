//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(() => {console.log("connected to the mobngoDB database")})
.catch((err) => {console.log(err)});

// const secret = ""

userSchema = new mongoose.Schema({
    email:String,
    password:String
})
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const User = mongoose.model("users",userSchema);



app.get("/",(req,res) => {
    res.render('home');
})


app.route('/register')
.get((req,res) => {
    res.render('register');
})
.post((req,res) => {
    const user = new User({
        email:req.body.username,
        password:req.body.password
    })

    user.save();
    res.render("secrets");
});

app.route('/login')
.get((req,res) => {
    res.render('login');
})
.post((req,res) => {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email:userName})
    .then((result) => {
        if(result.password === password){
            console.log("sending secrets to "+result.email);
            console.log("password is "+result.password);
            res.render('secrets');
        }
        // res.send(result);
    })
    .catch((err) => {console.log(err)});
    
});

app.listen(3000,(req,res) => {console.log("server started at port 3000")})