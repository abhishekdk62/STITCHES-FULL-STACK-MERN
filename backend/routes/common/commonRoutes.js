const express = require('express');
const { login, logout, check, updateProfile } = require('../../controllers/common/commonController');
const { refreshToken } = require('../../controllers/authToken/authController');
const router=express.Router()

router.post("/login",login)
router.post("/update",updateProfile)
router.post("/logout",logout)
router.get("/check",check)
router.get("/refreshToken",refreshToken)

module.exports=router