import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: [true, 'name please'],
  },
  email: {
   type: String,
   required: [true, 'email please'],
   unique: true,
   match: [
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    'please enter a valid email',
   ],
  },
  isAdmin:{
    type:Boolean,
    default: false
  },
  password: {
   type: String,
   required: [true, 'password please ....'],
   select:false
  },
 },
 {
  timestamps: true,
 }
)

// ENCRYPTION OF THE PASSWORD
userSchema.pre('save', async function (next) {
 if (!this.isModified('password')) {
  next()
 }
 const salt = await bcrypt.genSalt()
 this.password = await bcrypt.hash(this.password, salt)
})

// sign with jwtoken
userSchema.methods.getSignWithJsonToken = function () {
 return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE,
 })
}
userSchema.methods.matchPassword = function (plainPassword){

return  bcrypt.compare(plainPassword, this.password, function(err, result) {
    
        if(err)throw err
        return result
    });

}

const User = mongoose.model('User', userSchema)

export default User
