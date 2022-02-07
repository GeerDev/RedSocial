const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const { authentication } = require('../middlewares/authentication');

router.post('/', UserController.register);
router.post('/login', UserController.login);
router.put('/logout', authentication, UserController.logout);
router.get('/info', authentication, UserController.getInfoUserPost);
router.get('/infoFollowers', authentication, UserController.getInfoUserPostFollowers);
router.put('/follow/:_id', authentication, UserController.follow)
router.put('/unfollow/:_id', authentication, UserController.unfollow)

module.exports = router;