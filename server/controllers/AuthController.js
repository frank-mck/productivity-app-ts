const User = require('../models/User')

const AuthController = {
  getAllUsers: async (req, res) => {
    const users = await User.find({})
    try {
      res.send(users);
    } catch(err) {
      console.log(err)
    }
  },

  signup: async (req, res, next) => {
    const {username, email, hashedPassword} = req.body;
    try {
      const user = await User.create({ 
        username: username, email: email, password: hashedPassword
      });
      sendToken(user, 201, res)
    } catch (error) {
      console.log(error)
      res.status(404).json({success: false, error: 'Username or email already exist'})
    }
  },

  signin: async (req, res, next) => {
    const {email, hashedPassword } = req.body;
    if (!email || !hashedPassword) {
      res.status(400).json({ success: false, error: "Please provide email and password"})
    }

    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(404).json({success: false, error: "Invalid credentials!"})
      }

      const isMatch = await user.matchPasswords(hashedPassword);
      if(!isMatch) {
        res.status(404).json({success: false, error: "Invalid credentials!"})
      }

      sendToken(user, 200, res)
    } catch (error) {
      console.log(error)
    }
  },

  forgotpassword: (req, res, next) => {
    res.send('forgotpassword')
  },

  resetpassword: (req, res, next) => {
    res.send('resetpassword')
  }

}

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
}

module.exports = AuthController;