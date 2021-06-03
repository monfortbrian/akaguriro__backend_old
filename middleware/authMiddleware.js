import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
// protect route
export const protect = asyncHandler(async (req, res, next) => {
 let token
 if (
  req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')
 ) {
  token = req.headers.authorization.split(' ')[1]
 }
 if (!token) {
  res.status(403)
  throw new Error('login first...')
 }
 // then we can check the token
 try {
  // verify the token
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  // as we signed with {id} the decode will handle the {id,iat...}
  console.log(decode)
  req.user = await User.findById(decode.id)
//   console.log("this is user",req.user)
  if (!req.user) {
   res.status(404)
   throw new Error(
    `sorry the user with such id ${decode.id} has been deleted or he is no more in database...`
   )
  }

  next()
 } catch (error) {
  res.status(500)
  throw new Error(`sorry error acure login again...`)
 }
})
// here we grant access to the user
export const admin = asyncHandler(async (req, res, next) => {

console.log(req.user.isAdmin)
 if (req.user && !req.user.isAdmin) {
  return res.json({
   success: false,
   message: 'only admin can execute this task ',
  })
 }
 next()
})
