const { User, Thought } = require('../models');

module.exports = {
    getThoughts(req, res){
        Thought.find()
        .select('-__v')
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(
            {
                thoughtText: req.body.thoughtText,
                username: req.body.username
            }
        )
        .then((thought) =>  {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true } 
            )
        })
        .then((user) => {
            if (!user) {res.status(404).json({ message: 'No user with that ID' })}
            res.json({ message: 'Thought added!' })
        })
        .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate({ path: 'reactions', select: '-__v' })
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
          if (!thought) {res.status(404).json({ message: 'No thought with that ID' })}
        }
        )
        .then(() => res.json({ message: 'Thought deleted!' }))
        .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true })
          .then((thought) => {
            if (!thought) {res.status(404).json({ message: 'No thought with that ID' })}
          }
          )
          .then(() => res.json({ message: 'Thought updated!' }))
          .catch((err) => res.status(500).json(err));
    },
    addReaction (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
          )
          .then(() => res.json({ message: 'Reaction added!' }))
          .catch((err) => res.status(500).json(err));
    },
    removeReaction (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.body.reactionId} } },
            { new: true }       
        )
        .then(() => res.json({ message: 'Reaction removed!' }))
        .catch((err) => res.status(500).json(err));
    }
}