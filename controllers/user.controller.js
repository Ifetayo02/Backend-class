const Customer = require("../models/user.model");
const ejs = require('ejs')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');


const getSignup = (req, res) => {
    res.render("signUp");
}

const getSignin = (req, res) => {   
    res.render("signIn");
}

const getDashboard = (req, res) => {
    res.render("dashboard");
}

const postSignup = (req, res) => {
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
    req.body.password = hashedPassword;
    const user = req.body;
    const newCustomer = new Customer(user);

    newCustomer.save()
        .then((savedUser) => {
            // ... (Your existing Nodemailer code remains exactly the same) ...

            // ✅ FIX: Replace res.redirect("/user/signin") with JSON
            return res.status(201).json({ 
                message: "Signup successful", 
                redirectUrl: "/login" 
            });
        })
        .catch((err) => {
            console.error("Error saving to DB:", err);
            res.status(500).json({ message: "Database error", error: err.message });
        });
}




module.exports = { postSignup, getSignup, postSignin, getSignin, getDashboard }