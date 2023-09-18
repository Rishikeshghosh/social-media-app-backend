import Post from "../Models/posts.js";
import User from "../Models/user.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    console.log(description, picturePath, userId);
    const user = await User.findById(userId);

    const newPost = new Post({
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );

      res.status(200).json({ updatedPost: updatedPost, status: "disliked" });
    } else {
      post.likes.set(userId, true);

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );

      res.status(200).json({ updatedPost: updatedPost, status: "liked" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const setComments = async (req, res) => {
  try {
    const { id } = req.user;
    const { postId, comment } = req.body;
    const post = await Post.findById(postId);
    if (post) {
      let user = await User.findById(id, {
        firstName: 1,
        lastName: 1,
        picturePath: 1,
      });
      const currentdate = new Date();
      const date =
        "Date: " +
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear();

      const time =
        "Time: " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: { user: user, comment: comment, date: date, time: time },
          },
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    let post = await Post.findByIdAndDelete(postId);
    res.status(201).json(post);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
