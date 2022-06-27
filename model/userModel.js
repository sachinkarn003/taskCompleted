const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your first name!'],
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!'],
        trim: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide your valid email']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //This only works on CREATE and SAVE!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same!'
        }
    }

});



userSchema.pre('save', async function(next) {
    //Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field 
    this.passwordConfirm = undefined;
    next();
});



userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};



const User = mongoose.model('User', userSchema);
module.exports = User;