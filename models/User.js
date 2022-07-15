const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [ isEmail, 'invalid email' ]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        }
    }
)

userSchema.virtual("friendCount").get(function() {
    return this.friends.length;
})

const user = model("user", userSchema)

module.exports = Thought;