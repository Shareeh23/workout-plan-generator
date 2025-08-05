const fs = require('fs');
const WorkoutPlan = require('../models/workoutPlanModel');
const User = require('../models/user');
const AuditLog = require('../models/auditLogSchema');
const { validationResult } = require('express-validator');

exports.createPlan = async (req, res, next) => {
  try {
    let planData;
    
    // Parse the planData if it's a string
    if (req.body.planData) {
      try {
        planData = typeof req.body.planData === 'string' 
          ? JSON.parse(req.body.planData) 
          : req.body.planData;
      } catch (parseError) {
        console.error('Error parsing planData:', parseError);
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        }
        return res.status(400).json({
          status: 'error',
          message: 'Invalid planData format',
          details: parseError.message
        });
      }
    } else {
      planData = req.body;
    }

    // Parse stringified arrays if they exist
    const parseIfString = (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    };

    // Process arrays to ensure they're actual arrays
    const processedData = {
      ...planData,
      prioritizedMuscles: parseIfString(planData.prioritizedMuscles) || [],
      neutralPoints: parseIfString(planData.neutralPoints) || [],
      weakPoints: parseIfString(planData.weakPoints) || [],
      sessions: parseIfString(planData.sessions) || []
    };

    // Update req.body with processed data for validation
    req.body = { ...processedData };

    // Run validation
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Image file is required'
      });
    }

    // Create the workout plan
    const workoutPlan = new WorkoutPlan({
      source: 'predefined',
      planName: processedData.planName,
      programTheme: processedData.programTheme,
      imageUrl: `/uploads/${req.file.filename}`,
      prioritizedMuscles: processedData.prioritizedMuscles,
      neutralPoints: processedData.neutralPoints,
      weakPoints: processedData.weakPoints,
      trainingDays: processedData.trainingDays,
      sessions: processedData.sessions,
      metadata: {
        lastModified: new Date(),
        createdBy: req.user.userId || req.user._id,
        requestParams: {
          planName: processedData.planName,
          trainingDays: processedData.trainingDays
        }
      }
    });

    const savedPlan = await workoutPlan.save();

    // Create audit log
    try {
      await AuditLog.create({
        admin: req.user.userId || req.user._id,
        action: 'CREATE_PLAN',
        targetId: savedPlan._id,
        metadata: { 
          planName: savedPlan.planName,
          trainingDays: savedPlan.trainingDays
        }
      });
    } catch (auditError) {
      console.error('Error creating audit log:', auditError);
    }

    return res.status(201).json({
      status: 'success',
      message: 'Workout plan created successfully',
      data: savedPlan
    });

  } catch (error) {
    console.error('Error in createPlan:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  }
  next(error);
};

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.find({ source: 'predefined' }).sort({
      createdAt: -1,
    });
    await AuditLog.create({
      admin: req.user.userId,
      action: 'VIEW_PLANS',
    });
    res.json({
      status: 'success',
      results: plans.length,
      data: plans,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      'name email isAdmin createdAt updatedAt lastActivity workoutHistory workoutPlan'
    )
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate({
        path: 'workoutPlan',
        select: 'planName trainingDays createdAt',
      })
      .populate({
        path: 'workoutHistory.planRef',
        select: 'planName createdAt completedAt',
      });

    if (!req.user?._id && !req.user?.userId) {
      throw new Error('No user ID found in request');
    }

    const adminId = req.user?._id || req.user?.userId;

    // Log admin action
    await AuditLog.create({
      admin: adminId,
      action: 'VIEW_USERS',
      metadata: {
        userCount: users.length,
      },
    });

    res.json({
      status: 'success',
      results: users.length,
      data: users,
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
        errors: errors.array(),
      });
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, source: 'predefined' },
      {
        ...req.body,
        'metadata.lastModified': new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found',
      });
    }

    await AuditLog.create({
      admin: req.user.userId,
      action: 'UPDATE_PLAN',
      targetId: plan._id,
      metadata: { changes: req.body },
    });

    res.json({
      status: 'success',
      data: plan,
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
      source: 'predefined',
    });

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found',
      });
    }

    await AuditLog.create({
      admin: req.user.userId,
      action: 'DELETE_PLAN',
      targetId: plan._id,
      metadata: { planName: plan.planName },
    });

    res.json({
      status: 'success',
      data: null,
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
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};
