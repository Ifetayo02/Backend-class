const express = require('express');
const router = express.Router();
const {postSignup,getSignup,getSignin, getDashboard,postSignin} = require('../controllers/user.controller');

router.get('/signUp', getSignup);
router.post('/register', postSignup);
router.get("/signIn", getSignin);
router.post("/login", postSignin);
router.get("/dashboard", getDashboard);

module.exports = router;