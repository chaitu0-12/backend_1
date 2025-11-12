const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentFeedback = sequelize.define(
    'StudentFeedback',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'student_id' },
      requestId: { type: DataTypes.INTEGER, allowNull: true, field: 'request_id' },
      seniorEmail: { type: DataTypes.STRING(160), allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comments: { type: DataTypes.STRING(500), allowNull: true, field: 'feedback_text' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { tableName: 'student_feedback',
      indexes: [
        {
          fields: ['student_id']
        },
        {
          fields: ['rating']
        }
      ]
    }
  );
  return StudentFeedback;
};
