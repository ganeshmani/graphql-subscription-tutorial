import Mongoose from 'mongoose';

const postSchema = new Mongoose.Schema({
  title: {
    type: String
  },
  body: {
    type: String
  },
  createdUserId: {
    type: String
  }
});

class Post {
  static getPostById(id) {
    return this.findOne({
      _id: id
    }).exec();
  }

  static insertPost(postInfo) {
    const post = this(postInfo);

    return post.save();
  }
}

postSchema.loadClass(Post);

export default Mongoose.model('Post', postSchema);
