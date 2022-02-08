const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')
const { authentication } = require('../middlewares/authentication');
const { isAuthorPost, isAuthorComment } = require('../middlewares/isAuthor');


router.post('/', authentication, PostController.create)
router.get('/', PostController.getAll)
router.get('/likes', PostController.getAllLikesWithUsers)
router.get('/id/:_id', PostController.getById)
router.get('/title/:title', PostController.getByTitle)
router.put('/:_id', authentication, isAuthorPost, PostController.update)
router.put('/reviews/:_id', authentication, PostController.insertReview)
router.put('/updateReview/:_id', authentication, isAuthorComment, PostController.updateReview)
router.put('/deleteReview/:_id', PostController.deleteReview)
router.put('/like/:_id', authentication, PostController.like)
router.put('/dislike/:_id', authentication, PostController.dislike)
router.put('/reviews/likeComment/:_id', authentication, PostController.likeComment)
router.put('/reviews/dislikeComment/:_id', authentication, PostController.dislikeComment)
router.delete('/:_id', authentication, PostController.delete)


module.exports = router;