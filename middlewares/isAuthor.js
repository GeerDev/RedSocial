const Post = require("../models/Post");

const isAuthorPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Este post no es tuyo" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({
        error,
        message: "Ha habido un problema al comprobar la autoría del post",
      });
  }
};

const isAuthorComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    for (const element of post.reviews) {
                console.log(element);
                if ((element._id.toString() === req.body._id) && (element.userId.toString() === req.user._id.toString())) {
                   next()
                } else {
                    return res.status(403).send({ message: 'Este comment no es tuyo' });
            }
        }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({
        error,
        message: "Ha habido un problema al comprobar la autoría del comment",
      });
  }
};

module.exports = { isAuthorPost, isAuthorComment };
