const express = require('express');

const router = express.Router();

const userController = require('../controllers/login');

router.post('/user/signup',userController.addUserInfo);

router.post('/user/login',userController.loginUser);

module.exports = router;    