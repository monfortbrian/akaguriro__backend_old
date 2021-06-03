import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

// @desc    Auth user & get token
// @route   POST /api/v1/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
 const { email, password } = req.body
if(email == '' || password == ''){
    return res.status(404).json({success:false,message:"fill the field please..."})
}
 const user = await User.findOne({ email }).select('+password')
console.log(user)
 if (user) {
     bcrypt.compare(password, user.password).then(result =>{
         console.log(result)
      if(!result){
       return res.json({success:false,message:"wrong password"})
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: user.getSignWithJsonToken(),
       })
     })
  
 } else {
  res.status(401)
  throw new Error('Invalid email or password')
 }
})

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
 const { name, email, password } = req.body

 const userExists = await User.findOne({ email })

 if (userExists) {
  res.status(400)
  throw new Error('User already exists')
 }

 const user = await User.create({
  name,
  email,
  password,

 })

 if (user) {
  res.status(201).json({
   _id: user._id,
   name: user.name,
   email: user.email,
   isAdmin: user.isAdmin,
   token: user.getSignWithJsonToken(),
  })
 } else {
  res.status(400)
  throw new Error('Invalid user data')
 }
})

// @desc    Get user profile
// @route   GET /api/users/v1/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
 const user = await User.findById(req.user._id)

 if (user) {
  res.json({
   _id: user._id,
   name: user.name,
   email: user.email,
   isAdmin: user.isAdmin,
  })
 } else {
  res.status(404)
  throw new Error('User not found')
 }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
 const user = await User.findById(req.user._id)

 if (user) {
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  if (req.body.password) {
   user.password = req.body.password
  }

  const updatedUser = await user.save()

  res.json({
   _id: updatedUser._id,
   name: updatedUser.name,
   email: updatedUser.email,
   isAdmin: updatedUser.isAdmin,
   token: updatedUser.getSignWithJsonToken(),
  })
 } else {
  res.status(404)
  throw new Error('User not found')
 }
})

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
 const users = await User.find({})
 res.status(200).json({ success: true, data: users })
})

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
 const user = await User.findById(req.params.id)

 if (user) {
  await user.remove()
  res.json({ success: true, message: 'User removed' })
 } else {
  res.status(404)
  throw new Error('User not found')
 }
})

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
 const user = await User.findById(req.params.id).select('-password')

 if (user) {
  res.status(200).json({ success: true, data: user })
 } else {
  res.status(404)
  throw new Error('User not found')
 }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserProfile = asyncHandler(async (req, res) => {
 const user = await User.findById(req.params.id)

 if (user) {
  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  user.isAdmin = !user.isAdmin
  const updatedUser = await user.save()

  res.json({
   _id: updatedUser._id,
   name: updatedUser.name,
   email: updatedUser.email,
   isAdmin: updatedUser.isAdmin,
  })
 } else {
  res.status(404)
  throw new Error('User not found')
 }
})
// @desc logout user
// @route GET /api/users/logout
// @access private
const logout = asyncHandler(async (req, res) => {
 if (req.user) req.user = null
 res.status(200).json({ success: true, message: 'successfully logout..' })
})
export {
 authUser,
 registerUser,
 logout,
 getUserProfile,
 updateUserProfile,
 getUsers,
 deleteUser,
 getUserById,
 updateUser,
}
