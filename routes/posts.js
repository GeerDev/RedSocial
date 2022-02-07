const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController')
const { authentication } = require('../middlewares/authentication');


router.post('/', authentication, PostController.create)
router.get('/', PostController.getAll)
router.get('/likes', PostController.getAllLikesWithUsers)
router.get('/id/:_id', PostController.getById)
router.get('/title/:title', PostController.getByTitle)
router.put('/:_id', authentication, PostController.update)
router.put('/reviews/:_id', authentication, PostController.insertReview)
router.put('/updateReview/:_id', PostController.updateReview)
router.put('/deleteReview/:_id', PostController.deleteReview)
router.put('/like/:_id', authentication, PostController.like)
router.put('/dislike/:_id', authentication, PostController.dislike)
router.delete('/:_id', authentication, PostController.delete)


module.exports = router;