const express=require('express');
const router=express.Router();
const user=require('../modules/user.js');
const WrapAsync = require('../utils/WrapAsync.js');
const flash=require('connect-flash');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController=require('../controllers/users.js');

//Signupform and signup
router.route('/signup')
.get(userController.renderSignupForm)
.post(WrapAsync(userController.signup));

//loginform and login
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

//logout
router.get('/logout',userController.logout);

module.exports=router;