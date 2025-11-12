const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentInterest = sequelize.define(
    'StudentInterest',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'studentid' },
      type: { type: DataTypes.STRING(64), allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { 
      tableName: 'student_interests'
    }
  );
  return StudentInterest;
};