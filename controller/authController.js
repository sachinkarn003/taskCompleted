const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utills/appError');
const {promisify} = require('util');

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: "sucess",
            result: users.length,
            data: {
                users
            }
        })
    } catch (error) {
        console.log(error.message)
    }
};


///////////////  Auth Part //////////////////////////
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


exports.singup = async(req, res) => {
    try {
        let newData =  {
            name,
            lastName,
            email,
            password,
            passwordConfirm
        }=req.body
        const newUser = await User.create(newData );

        const token = signToken(newUser._id);
        res.status(201).json({
            status: "Success",
            token,
            data: {
                newUser
            }
        })
    } catch (error) {
        console.log(error.message)
    }
};

exports.login = async(req, res,next) => {
    try{
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please Provide Email and Password',400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');


    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3) If everything ok, send token to client
    const token=signToken(user._id);
    res.status(200).json({
        status:'success',
        token
    });
}
catch(error){
    console.log(error.message)
}

};

exports.protect = async(req, res, next) => {
    //1) Getting token and check of It's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    //3) Check if user still 
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The token belonging to this toekn dose no longer exist.', 401));
    }


    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles ['admin']. roles='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        };
        next();
    }
};



