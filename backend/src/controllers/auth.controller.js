const User = require('../models/User.model');
const Aalim = require('../models/Aalim.model');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../middleware/auth.middleware');
const { verifyFirebaseToken } = require('../config/firebase');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');

const register = catchAsync(async (req, res) => {
  const { email, password, name, firebaseToken } = req.body;

  if (!email || !name) {
    throw new ApiError(400, 'Email and name are required', 'VALIDATION_ERROR');
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered', 'DUPLICATE');

  let firebaseUid = null;
  if (firebaseToken) {
    const decoded = await verifyFirebaseToken(firebaseToken);
    if (decoded) firebaseUid = decoded.uid;
  }

  const userData = { email, password, name, role: 'user' };
  if (firebaseUid) userData.firebaseUid = firebaseUid;
  const user = await User.create(userData);

  const token = generateToken(user._id);
  sendSuccess(res, { user, token }, 'Registration successful', 201);
});

const login = catchAsync(async (req, res) => {
  const { email, password, firebaseToken } = req.body;

  let user = null;

  if (firebaseToken) {
    const decoded = await verifyFirebaseToken(firebaseToken);
    if (decoded) {
      user = await User.findOne({ firebaseUid: decoded.uid });
      if (!user) {
        user = await User.create({
          email: decoded.email,
          name: decoded.name || decoded.email.split('@')[0],
          firebaseUid: decoded.uid,
          role: 'user',
        });
      }
    }
  } else {
    if (!email || !password) {
      throw new ApiError(400, 'Email and password required', 'VALIDATION_ERROR');
    }
    user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid credentials', 'UNAUTHORIZED');
    }
  }

  if (!user.isActive) throw new ApiError(403, 'Account deactivated', 'FORBIDDEN');

  const token = generateToken(user._id);
  user.password = undefined;
  sendSuccess(res, { user, token }, 'Login successful');
});

const aalimRegister = catchAsync(async (req, res) => {
  const { email, password, name, fullName, qualifications, specialization, bio } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered', 'DUPLICATE');

  const user = await User.create({ email, password, name, role: 'aalim' });

  const aalim = await Aalim.create({
    userId: user._id,
    fullName: fullName || name,
    qualifications: qualifications || '',
    specialization: specialization || [],
    bio: bio || '',
    sanadCertificate: req.body.sanadCertificate || null,
    degreeCertificate: req.body.degreeCertificate || null,
  });

  const token = generateToken(user._id);
  sendSuccess(res, { user, aalim, token }, 'Aalim registration submitted for verification', 201);
});

const aalimLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'aalim' }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials', 'UNAUTHORIZED');
  }

  const aalim = await Aalim.findOne({ userId: user._id });
  const token = generateToken(user._id);
  user.password = undefined;

  sendSuccess(res, { user, aalim, token }, 'Aalim login successful');
});

const deleteAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  sendSuccess(res, null, 'Account deactivated');
});

module.exports = { register, login, aalimRegister, aalimLogin, deleteAccount };
