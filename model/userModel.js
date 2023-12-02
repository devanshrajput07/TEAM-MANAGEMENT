import mongoose from 'mongoose';
import crypto from 'crypto';

const generateNumericOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      select: false,
    },
    forgotPasswordToken: {
      type: Number,
      default: undefined,
    },
    forgotPasswordExpire: {
      type: Date,
      default: Date.now() + 15 * 60 * 1000, // 15 minutes
    },
    signupToken: {
      type: String,
    },
    signupTokenExpire: {
      type: Date,
      default: Date.now() + 5 * 60 * 1000,
    },
    signupVerification: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    boards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    }],
    cards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
    }],
    lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    }],
    chat: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    }],
    experience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPassword = async function (userSendPassword) {
  const flag = await bcrypt.compare(userSendPassword, this.password);
  return flag;
};

userSchema.methods.generateToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

userSchema.methods.generateForgotPasswordToken = async function () {
  const resetToken = generateNumericOTP();
  this.forgotPasswordToken = resetToken;
  this.forgotPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateSignupToken = async function () {
  const signupToken = crypto.randomBytes(20).toString('hex');
  this.signupToken = crypto.createHash('sha256').update(signupToken).digest('hex');
  this.signupTokenExpire = Date.now() + 5 * 60 * 1000;
  return signupToken;
};

userSchema.methods.markAsPremium = async function () {
  this.isPremium = true;
  this.subscriptionExpiresAt = new Date();
  this.subscriptionExpiresAt.setDate(this.subscriptionExpiresAt.getDate() + 30 * 60 *1000); // 30 days
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;