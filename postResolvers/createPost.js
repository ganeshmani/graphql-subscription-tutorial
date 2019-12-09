import PostModel from '../postModel';
import pubsub, { EVENTS } from '../subsriptions';
export default async (parent, args, context) => {
  try {
    let postInfo = {
      title: args.request.title,
      body: args.request.body,
      createdUserId: args.request.createdUserId
    };
    const postCollection = await PostModel.insertPost(postInfo);

    pubsub.publish(EVENTS.TOPIC.POST_CREATED, {
      postCreated: { postCollection }
    });

    return {
      success: true,
      data: postCollection,
      error: null
    };
  } catch (e) {
    return {
      success: false,
      data: null,
      error: {
        status: 500,
        message: e
      }
    };
  }
};
