const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
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
              validator: email => Admin.doesNotExist({ email }),
              message: 'Email already exists'
            }
        ],
    },
    password: {
        type: String,
        select: false,
        require: true,
        trim: true,
        minLength: [6, 'Password must be at least 6 characters']
    },
})
// hash password before save into DB
AdminSchema.post('validate', function ( doc, next) {
    if (this.isModified('password')) {
        doc.password = bcrypt.hashSync(doc.password, 10)
    }
    return next()
})

AdminSchema.statics.protectedFields = [
    '_id',
    '__v',
    'password'
]

AdminSchema.statics.doesNotExist = async (field) => {
    const admin = await Admin.find(field)
    return admin.length === 0
}

module.exports = Admin = mongoose.model("admin", AdminSchema);