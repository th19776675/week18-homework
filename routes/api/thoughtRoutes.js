const router = require('express').Router();
const {
    getThoughts,
    createThought,
    getSingleThought,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction
} = require('../../controllers/thoughtController');

// /api/users
router.route('/').get(getThoughts).post(createThought)

// /api/users/:userId
router.route('/:thoughtId').get(getSingleThought).delete(deleteThought).put(updateThought);

router.route('/:thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;
