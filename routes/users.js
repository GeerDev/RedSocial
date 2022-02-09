const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const { authentication } = require('../middlewares/authentication');
const { uploadUsersImages } = require('../middlewares/multer')

router.post('/', UserController.register);
router.put('/:_id', uploadUsersImages.single('imageUser'), UserController.updateUser)
router.post('/login', UserController.login);
router.put('/logout', authentication, UserController.logout);
router.get('/info', authentication, UserController.getInfoUserPost);
router.get('/infoFollowers', authentication, UserController.getInfoUserPostFollowers);
router.get('/:_id', UserController.getById);
router.get('/name/:name', UserController.getByName);
router.put('/follow/:_id', authentication, UserController.follow);
router.put('/unfollow/:_id', authentication, UserController.unfollow);
router.get('/confirm/:emailToken',UserController.confirm)
router.get('/recoverPassword/:email',UserController.recoverPassword)
router.put('/resetPassword/:recoverToken',UserController.resetPassword)

module.exports = router;