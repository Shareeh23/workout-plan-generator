const WorkoutPlan = require('../models/workoutPlanSchema');
const User = require('../models/user');
const AuditLog = require('../models/auditLogSchema');
const { validationResult } = require('express-validator');

// Create new predefined plan
exports.createPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const plan = await WorkoutPlan.create({
      ...req.body,
      source: 'predefined',
      createdBy: req.user.userId,
      metadata: {
        lastModified: new Date()
      }
    });

    await AuditLog.create({
      admin: req.user.userId,
      action: 'CREATE_PLAN',
      targetId: plan._id,
      metadata: { planName: plan.planName }
    });

    res.status(201).json({
      status: 'success',
      data: plan
    });
  } catch (err) {
    next(err);
  }
};

// Get all predefined plans
exports.getPlans = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find({ source: 'predefined' }).sort({ createdAt: -1 });
    await AuditLog.create({
      admin: req.user.userId,
      action: 'VIEW_PLANS'
    });
    res.json({
      status: 'success',
      results: plans.length,
      data: plans
    });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email isAdmin createdAt');
    
    // Log admin action
    await AuditLog.create({
      admin: req.user.userId,
      action: 'VIEW_USERS'
    });
    
    res.json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// Update predefined plan
exports.updatePlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, source: 'predefined' },
      { 
        ...req.body,
        'metadata.lastModified': new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found'
      });
    }

    await AuditLog.create({
      admin: req.user.userId,
      action: 'UPDATE_PLAN',
      targetId: plan._id,
      metadata: { changes: req.body }
    });

    res.json({
      status: 'success',
      data: plan
    });
  } catch (err) {
    next(err);
  }
};

// Delete predefined plan
exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({ 
      _id: req.params.id,
      source: 'predefined' 
    });

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found'
      });
    }

    await AuditLog.create({
      admin: req.user.userId,
      action: 'DELETE_PLAN',
      targetId: plan._id,
      metadata: { planName: plan.planName }
    });

    res.json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// Get audit logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, adminId, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (adminId) query.admin = adminId;

    const logs = await AuditLog.find(query)
      .populate('admin', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AuditLog.countDocuments(query);

    res.json({
      status: 'success',
      results: count,
      data: logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
};
