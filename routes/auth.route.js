const express = require("express");

//used for routing
const router = express.Router()

//validations
const { validRegister,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator } = require('../helper/valid')


//load controller

const {
    registerController,
    activationController,
    loginController,
    forgotPasswordController,
    resetPasswordController
} = require('../controllers/auth.controller')

router.post('/register', validRegister, registerController)
router.post('/login', validLogin, loginController)
router.post('/activation', activationController)
router.post('/forgotpassword', forgotPasswordValidator, forgotPasswordController)
router.post('/resetpassword', resetPasswordValidator, resetPasswordController)

module.exports = router