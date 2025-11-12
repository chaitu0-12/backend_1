const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentInterest = sequelize.define(
    'StudentInterest',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'student_id' },
      interests: { type: DataTypes.TEXT, allowNull: true },
      skills: { type: DataTypes.TEXT, allowNull: true },
      availability: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },
    { 
      tableName: 'student_interests',
      indexes: [
        {
          fields: ['student_id']
        }
      ]
    }
  );
  return StudentInterest;
};