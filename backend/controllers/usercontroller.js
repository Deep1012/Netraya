const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: 'Login successful', token, isNewUser: !user.profileCompleted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      phone, dob, gender, address, specialization, licenseNumber, practiceLength,
      affiliation, identificationType, identificationNumber, consentHealth,
      consentDisclosure, agreePrivacyPolicy
    } = req.body;

    await User.findByIdAndUpdate(userId, {
      phone, dob, gender, address, specialization, licenseNumber,
      practiceLength, affiliation, identificationType, identificationNumber,
      consentHealth, consentDisclosure, agreePrivacyPolicy,
      file: req.file ? req.file.path : '',
      profileCompleted: true
    });

    res.json({ message: 'Profile completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, completeProfile, upload };
