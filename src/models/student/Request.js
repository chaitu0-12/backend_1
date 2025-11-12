const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Request = sequelize.define(
    'Request',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      seniorId: { type: DataTypes.INTEGER, allowNull: false, field: 'senior_id' },
      seniorEmail: { type: DataTypes.STRING(160), allowNull: false, field: 'task_description' },
      type: { type: DataTypes.ENUM('hospital', 'rides', 'groceries', 'companionship'), allowNull: false, field: 'status' },
      status: { type: DataTypes.ENUM('new', 'assigned', 'in_progress', 'completed'), allowNull: false, defaultValue: 'new' },
      assignedStudentId: { type: DataTypes.INTEGER, allowNull: true, field: 'student_id' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },
    { tableName: 'requests',
      indexes: [
        {
          fields: ['student_id']
        },
        {
          fields: ['status']
        }
      ]
    }
  );

  return Request;
};

