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



const postSignin = (req, res) => {
    const { email, password } = req.body;

    Customer.findOne({ email })
        .then((foundCustomers) => {
            if (!foundCustomers) {
                console.log("Invalid email");
                return res.status(400).json({message: "Invalid email or password"})
            } 
            // if (foundCustomers.password !== password) {
            //     console.log("Invalid Password");
            //     return res.status(400).json({ message: "Invalid email or password"});
            // }


            // Compare provided password with hashed one
            const isMatch = bcrypt.compareSync(password, foundCustomers.password);

            if(!isMatch) {
                console.log("Invalid Password");
                return res.status(400).json({ message: "Invalid email or password"});
            }


            
            res.redirect("/user/dashboard");

            // Success
            return res.json({
                message: "Login Successful",
                user: {
                    id: foundCustomers._id,
                    email: foundCustomers.email,
                    firstName: foundCustomers.firstName,
                    lastName: foundCustomers.lastName
                }
            })


            
        })
        .catch((err) => {
            console.error("Error during signin:", err);
            res.status(500).send("Internal server error");
        });
}



module.exports = { postSignup, getSignup, postSignin, getSignin, getDashboard }