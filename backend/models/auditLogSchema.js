const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE_PLAN', 'UPDATE_PLAN', 'DELETE_PLAN', 'VIEW_USERS', 'LOGIN']
  },
  targetId: mongoose.Schema.Types.ObjectId,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
