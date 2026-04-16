const Customer = require("../models/user.model");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// These are for EJS (SSR). If you are using React, you might not need these, 
// but I'll leave them here in case you use them for other things.
const getSignup = (req, res) => { res.render("signUp"); }
const getSignin = (req, res) => { res.render("signIn"); }
const getDashboard = (req, res) => { res.render("dashboard"); }

const postSignup = (req, res) => {
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
    req.body.password = hashedPassword;
    const user = req.body;
    const newCustomer = new Customer(user);

    newCustomer.save()
        .then((savedUser) => {
            console.log("Customer saved:", savedUser);

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'abdulqoyumjamiu@gmail.com',
                    pass: 'eqzx xniv gqjw grvt' 
                }
            });

            let mailOptions = {
                from: 'abdulqoyumjamiu@gmail.com',
                to: [savedUser.email],
                subject: 'Welcome to our Application',
                html: `
                    <div style="background-color: #f4f4f4; padding: 0 0 10px; border-radius: 30px 30px 0 0;">
                        <div style="padding-top: 20px; height: 100px; border-radius: 30px 30px 0 0 ; background: linear-gradient(-45deg, #f89b29 0%, #ff0f7b 100% );">
                            <h1 style="color:white; text-align: center;">Welcome to our Application</h1>
                        </div>
                        <div style="padding: 30px 0; text-align: center;">
                            <p style="font-size: 18px;"><span style="font-weight: 600;">Congratulations!</span> Your sign-up was successful!</p>
                            <p>Thank you for registering. We are excited to have you on board.</p>
                        </div>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log("Email Error:", error);
                else console.log('Email sent: ' + info.response);
            });

            // ✅ FIX: Changed from res.redirect to res.json
            return res.status(201).json({ 
                status: true, 
                message: "Signup successful. Please login." 
            });
        })
        .catch((err) => {
            console.error("Error saving to DB:", err);
            return res.status(500).json({ status: false, message: "Error: " + err.message });
        });
}

const postSignin = (req, res) => {
    const { email, password } = req.body;

    Customer.findOne({ email })
        .then((foundCustomer) => {
            if (!foundCustomer) {
                console.log("Invalid email");
                return res.status(400).json({ status: false, message: "Invalid email or password" });
            } 

            const isMatch = bcrypt.compareSync(password, foundCustomer.password);

            if (!isMatch) {
                console.log("Invalid Password");
                return res.status(400).json({ status: false, message: "Invalid email or password" });
            }

            // ✅ FIX: Removed res.redirect and kept ONLY res.json
            return res.status(200).json({
                status: true,
                message: "Login Successful",
                user: {
                    id: foundCustomer._id,
                    email: foundCustomer.email,
                    firstName: foundCustomer.firstName,
                    lastName: foundCustomer.lastName
                }
            });
        })
        .catch((err) => {
            console.error("Error during signin:", err);
            return res.status(500).json({ status: false, message: "Internal server error" });
        });
}

const getAllUsers = (req, res) => {
    Customer.find()
        .then((allUsers) => {
            console.log("All users:", allUsers);
            res.status(200).json(
                {
                    message: "Registered Users",
                    users: allUsers
                }
            );
        })
        .catch((err) => {
            console.error("Error fetching users:", err);
            res.status(500).send("Internal server error");
        });
};

module.exports = { postSignup, getSignup, postSignin, getSignin, getDashboard, getAllUsers };