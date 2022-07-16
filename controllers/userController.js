const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({ path: 'friends', select: '-__v' })
      .populate({ path: 'thoughts', select: '-__v' })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  deleteSingleUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {res.status(404).json({ message: 'No user with that ID' })}
      }
      )
      .then(() => res.json({ message: 'User deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  updateSingleUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true })
    .then((user) => {
      if (!user) {res.status(404).json({ message: 'No user with that ID' })}
    }
    )
    .then(() => res.json({ message: 'User updated!' }))
    .catch((err) => res.status(500).json(err));
  },
  addFriend(req,res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true } 
      ).then((user) => {
        if (!user) {res.status(404).json({ message: 'No user with that ID' })}
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true } 
        )
      })
      .then(() => res.json({ message: 'Friend added!' }))
      .catch((err) => res.status(500).json(err));
  },
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true } 
      ).then((user) => {
        if (!user) {res.status(404).json({ message: 'No user with that ID' })}
        return User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true } 
        )
      })
      .then(() => res.json({ message: 'Friend removed!' }))
      .catch((err) => res.status(500).json(err));
  }
};
