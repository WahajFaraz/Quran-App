const express = require('express');
const {
  getDashboard, getUsers, updateUser, getPendingAalims, verifyAalim,
  rejectAalim, getCategories, createCategory, updateCategory,
  deleteCategory, getReports, resolveReport,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

const router = express.Router();
router.use(protect, restrictTo('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.get('/aalims/pending', getPendingAalims);
router.patch('/aalims/:id/verify', verifyAalim);
router.patch('/aalims/:id/reject', rejectAalim);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/reports', getReports);
router.patch('/reports/:id', resolveReport);

module.exports = router;
