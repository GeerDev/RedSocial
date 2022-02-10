const posts = require('./posts');
const users = require('./users');
module.exports = {
    paths:{
        '/posts':{
            ...posts
        },
        '/users':{
            ...users
        }
    }
}