const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')
const { authentication } = require('../middlewares/authentication');
const { isAuthorPost, isAuthorComment } = require('../middlewares/isAuthor');
const { uploadPostsImages, uploadCommentsImages } = require('../middlewares/multer')


router.post('/', authentication, uploadPostsImages.single('imagePost'), PostController.create)

router.get('/', PostController.getAll)
router.get('/likes', PostController.getAllLikesWithUsers)
router.get('/id/:_id', PostController.getById)
router.get('/title/:title', PostController.getByTitle)

router.put('/:_id', authentication, isAuthorPost, uploadPostsImages.single('imagePost'), PostController.update)
router.put('/comments/:_id', authentication, uploadCommentsImages.single('imageComment'), PostController.insertComment)
router.put('/updateComment/:_id', authentication, isAuthorComment, uploadCommentsImages.single('imageComment'), PostController.updateComment)
router.put('/deleteComment/:_id', authentication, isAuthorComment, PostController.deleteComment)
router.put('/like/:_id', authentication, PostController.like)
router.put('/dislike/:_id', authentication, PostController.dislike)
router.put('/comments/likeComment/:_id', authentication, PostController.likeComment)
router.put('/comments/dislikeComment/:_id', authentication, PostController.dislikeComment)

router.delete('/:_id', authentication, isAuthorPost, PostController.delete)


module.exports = router;