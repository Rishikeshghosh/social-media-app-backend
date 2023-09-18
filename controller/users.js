import Post from "../Models/posts.js";
import User from "../Models/user.js";

export const getUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const friends = await Promise.all(
      user.friends.map((id) =>
        User.findOne(
          { _id: id },
          {
            firstName: 1,
            lastName: 1,
            email: 1,
            occupation: 1,
            location: 1,
            picturePath: 1,
          }
        )
      )
    );

    res.status(200).json(friends);
  } catch (error) {
    res.status({ error: error.message });
  }
};

export const addRemoveFriends = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { id } = req.user;
    let user = await User.findById(id);
    console.log(user);

    if (user.friends.includes(friendId)) {
      let currentUser = await User.findOneAndUpdate(
        { email: user.email },
        { $pull: { friends: friendId } },
        { new: true }
      );
      let friend = await User.findOneAndUpdate(
        { _id: friendId },
        { $pull: { friends: user._id } },
        { new: true }
      );
      currentUser.save();
      friend.save();
    } else {
      let currentUser = await User.findOneAndUpdate(
        { email: user.email },
        { $push: { friends: friendId } }
      );

      let friend = await User.findOneAndUpdate(
        { _id: friendId },
        { $push: { friends: user._id } },
        { new: true }
      );
      currentUser.save();
      friend.save();
    }
    let updatedUser = await User.findById(id);

    const friends = await Promise.all(
      updatedUser.friends.map((id) =>
        User.findOne(
          { _id: id },
          {
            firstName: 1,
            lastName: 1,
            email: 1,
            occupation: 1,
            location: 1,
            picturePath: 1,
          }
        )
      )
    );

    res.status(201).json(friends);
  } catch (error) {
    res.status({ error: error.message });
  }
};
export const changeProfiePic = async (req, res) => {
  try {
    const { id } = req.user;
    const { picturePath, occupation, location } = req.body;
    let user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          picturePath: picturePath,
          occupation: occupation,
          location: location,
        },
      },
      { new: true }
    );
    let updatedUser = await User.findById(user._id, {
      firstName: 1,
      lastName: 1,
      picturePath: 1,
    });

    let updateUserPosts = await Post.updateMany(
      { userId: id },
      { $set: { userPicturePath: picturePath } }
    );

   /*  let allUserComments = await Post.find({ userId: id });

    const updateComments = async (allUserComments) => {
      for (let value of allUserComments) {
        for (let i = 0; i < value.comments.length; i++) {
          const { comment, date, time } = value.comments[i];
          await Post.findByIdAndUpdate(value._id, {
            $set: {
              comments: {
                user: updatedUser,
                comment: comment,
                date: date,
                time: time,
              },
            },
          });
        }
      }
    };
    await updateComments(allUserComments);
 */
    res.status(201).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
