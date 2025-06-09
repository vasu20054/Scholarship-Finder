const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, firstName, username) => {
  return jwt.sign({ id, firstName, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    university,
    cgpi,
    degree,
    specialization,
  } = req.body;

  if (
    !firstName || !lastName || !username || !email || !password ||
    !university || cgpi === undefined || !degree || !specialization
  ) {
    res.status(400);
    throw new Error('Please enter all required fields for registration');
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    if (userExists.email === email) {
      throw new Error('User with this email already exists');
    } else {
      throw new Error('User with this username already exists');
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    university,
    cgpi,
    degree,
    specialization,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      university: user.university,
      cgpi: user.cgpi,
      degree: user.degree,
      specialization: user.specialization,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.firstName, user.username),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { username, identifier, password } = req.body;
  const loginField = identifier || username;
  const user = await User.findOne({
    $or: [{ username: loginField }, { email: loginField }]
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      university: user.university,
      cgpi: user.cgpi,
      degree: user.degree,
      specialization: user.specialization,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.firstName, user.username),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials (username/email or password)');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      university: user.university,
      cgpi: user.cgpi,
      degree: user.degree,
      specialization: user.specialization,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.university = req.body.university || user.university;
    user.cgpi = req.body.cgpi !== undefined ? req.body.cgpi : user.cgpi;
    user.degree = req.body.degree || user.degree;
    user.specialization = req.body.specialization || user.specialization;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });
      if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
        res.status(400);
        throw new Error('Username already taken');
      }
    }
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        res.status(400);
        throw new Error('Email already taken');
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      university: updatedUser.university,
      cgpi: updatedUser.cgpi,
      degree: updatedUser.degree,
      specialization: updatedUser.specialization,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id, updatedUser.firstName, updatedUser.username),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};