import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../../../DB/Models/user.model.js"
import { nanoid } from 'nanoid'
const otps = {}; 
// ========================================= SignUp API ================================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */
export const signUp = async (req, res, next) => {

    //  destructure the required data from the request body 
    const {username,email,password,role} = req.body

    //  check if the user already exists in the database using the email
    const isEmailDuplicated = await User.findOne({ email })
    if (isEmailDuplicated) {
        return next(new Error('Email already exists,Please try another email', { cause: 409 }))
    }

    //  password hashing
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

    //  create new document in the database
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        test:req.body.test
    })

    // return the response
    res.status(201).json({
        success: true,
        message: 'User created successfully, please check your email to verify your account',
        data: newUser
    })
}

// ========================================= SignIn API ================================//

/**
 * destructuring the required data from the request body 
 * get user by email and check if isEmailVerified = true
 * if not return error invalid login credentails
 * if found
 * check password
 * if not return error invalid login credentails
 * if found
 * generate login token
 * updated isLoggedIn = true  in database
 * return the response
 */

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    // get user by email
    const user = await User.findOne({ email})
    if (!user) {
        return next(new Error('Login credentials are invalid email error', { cause: 404 }))
    }
    // check password
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
        return next(new Error('Login credentials are invalid password error', { cause: 404 }))
    }

    // generate login token
    const token = jwt.sign({ email, id: user._id, loggedIn: true }, process.env.JWT_SECRET_LOGIN, { expiresIn: '1d' })
    // updated isLoggedIn = true  in database

    await user.save()

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: {
            token
        }
    })
}
//================================ Update password API =====================//
export const update_password = async (req, res, next) => {
    //destruct data
     const { email,new_password, old_password} = req.body
     const { _id } = req.authUser
     //check email
     const isEmailExists = await User.findOne({ email })
     if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))
     //check old password
    const isOldPasswordCorrect = bcrypt.compareSync(old_password,isEmailExists.password )
    if (!isOldPasswordCorrect) {
     return res.json({message:"old password rang"})
    } 
    //create new password
     const hashPass = bcrypt.hashSync(new_password, +process.env.SALT_ROUNDS)
     const updatedUser = await User.findByIdAndUpdate(_id ,{password:hashPass}, {new: true})
 
     if (!updatedUser) return next(new Error('update fail'))
     res.status(200).json({ message: 'done change password success' })
     
 }
 
// ************************************forgetPassword*************************************

export const forgetPassword = async (req, res, next) => {
    const {email} = req.body;
    
    const isEmailExists = await User.findOne({ email })
    if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))

    // generateUniqueString use nanoid unique OTP
    const otp = nanoid(6)
    
    // Store the OTP with the associated email
    otps[email] = otp;
    
    res.status(200).json({message:'OTP generated successfully.',otp});
}

// ************************************resetPassword*************************************
export const resetPassword = async (req, res, next) => {
    const {otp ,email,newPassword}= req.body;

    const isEmailExists = await User.findOne({ email })
    if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))
  
    // Validate the OTP
    if (otps[email] && otps[email] === otp) {
  
  const hashPass = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)
  
  isEmailExists.password=hashPass
      // Remove the used OTP
      delete otps[email];
      isEmailExists.save()
      res.send('Password reset successfully place dont forget agin ');
    } else {
      res.status(400).send('Invalid or expired OTP.');
    }
}


