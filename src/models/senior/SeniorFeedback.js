const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SeniorFeedback = sequelize.define(
    'SeniorFeedback',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      requestId: { type: DataTypes.INTEGER, allowNull: true, field: 'request_id' }, // Allow null for general feedback
      seniorId: { type: DataTypes.INTEGER, allowNull: true, field: 'senior_id' }, // Allow null for anonymous feedback
      studentId: { type: DataTypes.INTEGER, allowNull: true, field: 'student_id' }, // Allow null for general feedback
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      feedback: { type: DataTypes.TEXT, allowNull: true, field: 'feedback_text' },
      // New fields to capture services requested and desired features
      servicesNeeded: { type: DataTypes.TEXT, allowNull: true, field: 'servicesneeded' }, // comma-separated or JSON string
      featuresNeeded: { type: DataTypes.TEXT, allowNull: true, field: 'featuresneeded' }, // comma-separated or JSON string
      serviceQuality: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 }, field: 'service_quality' },
      punctuality: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
      communication: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
      wouldRecommend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'would_recommend' },
      additionalComments: { type: DataTypes.TEXT, allowNull: true, field: 'additional_comments' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { 
      tableName: 'senior_feedback',
      indexes: [
        {
          fields: ['request_id'],
          unique: true // One feedback per request
        },
        {
          fields: ['senior_id']
        },
        {
          fields: ['student_id']
        },
        {
          fields: ['rating']
        }
      ]
    }
  );

  return SeniorFeedback;
};