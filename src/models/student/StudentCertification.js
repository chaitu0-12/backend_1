const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentCertification = sequelize.define(
    'StudentCertification',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'student_id' },
      title: { type: DataTypes.STRING(160), allowNull: false, field: 'certification_name' },
      // New: store file binary directly in DB
      fileBlob: { type: DataTypes.BLOB('long'), allowNull: true },
      mimeType: { type: DataTypes.STRING(100), allowNull: true, field: 'credential_id' },
      fileName: { type: DataTypes.STRING(255), allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { tableName: 'student_certifications',
      indexes: [
        {
          fields: ['student_id']
        }
      ]
    }
  );
  return StudentCertification;
};
