const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define(
    'Student',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING(120), allowNull: false, field: 'name' },
      phoneNumber: { type: DataTypes.STRING(20), allowNull: false, field: 'phone' },
      email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password' },
      // store binary image data as BLOB (long)
      idProofUrl: { type: DataTypes.BLOB('long'), allowNull: false, field: 'profile_picture' },
      description: { type: DataTypes.TEXT, allowNull: true, field: 'college' },
      // Legacy URL for avatar (kept); new blob-based avatar fields below
      avatarUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'branch' },
      avatarBlob: { type: DataTypes.BLOB('long'), allowNull: true, field: 'year' },
      avatarMimeType: { type: DataTypes.STRING(100), allowNull: true },
      avatarFileName: { type: DataTypes.STRING(255), allowNull: true },
      termsAccepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'termsaccepted' },
      // Student performance tracking fields
      completedTasks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      hoursServed: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      score: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      pushToken: { type: DataTypes.STRING(255), allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },
    { tableName: 'students',
      indexes: [
        {
          fields: ['email'],
          unique: true
        }
      ]
    }
  );

  return Student;
};

