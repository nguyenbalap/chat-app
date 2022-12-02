const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate: [
            {
              validator: value => {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
              },
              message: '{VALUE} is not a valid email address!'
            },
            {
              validator: email => User.doesNotExist({ email }),
              message: 'Email already exists'
            }
        ],
    },
    password: {
        type: String,
        require: true,
        select: false,
        trim: true,
        minLength: [6, 'Password must be at least 6 characters']
    },
    isOnline: {
        type: Boolean,
        require: true
    },
    socketId: {
        type: String,
    }
})
// hash password before save into DB
UserSchema.post('validate', function ( doc, next) {
    if (this.isModified('password')) {
        doc.password = bcrypt.hashSync(doc.password, 10)
    }
    return next()
})

UserSchema.statics.protectedFields = [
    '_id',
    '__v',
    'password'
]

UserSchema.statics.doesNotExist = async (field) => {
    const user = await User.find(field)
    return user.length === 0
}
module.exports = User = mongoose.model("users", UserSchema);