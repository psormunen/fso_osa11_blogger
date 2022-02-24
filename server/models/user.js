const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: 'Username required',
    minlength: [3, 'Username must contain at least 3 characters'],
    unique: true
  },
  name: { type: String, },
  passwordHash: { type: String },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, userObject) => {
    userObject.id = userObject._id.toString()
    delete userObject._id
    delete userObject.__v
    delete userObject.passwordHash
  }
})
//mongoose.set('debug', true)

const User = mongoose.model('User', userSchema)

module.exports = User