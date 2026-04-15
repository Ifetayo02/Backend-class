const express = require('express');
const router = express.Router();
const {postSignUp,getSignUp,getSignin, getDashboard,postSignin} = require('../controllers/user.controller');

router.get('/signUp', getSignUp);
router.post('/register', postSignUp);
router.get("/signIn", getSignin);
router.post("/login", postSignin);
router.get("/dashboard", getDashboard);

module.exports = router;