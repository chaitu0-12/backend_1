const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Senior = sequelize.define(
    'Senior',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fullName: { type: DataTypes.STRING(120), allowNull: false, field: 'name' },
      email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
      age: { type: DataTypes.INTEGER, allowNull: false },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password' },
      // store binary image data as BLOB (long)
      govtIdProofUrl: { type: DataTypes.BLOB('long'), allowNull: false, field: 'profile_picture' },
      faceEmbedding: { type: DataTypes.TEXT, allowNull: true, field: 'address' },
      // Emergency contact fields
      policeContact: { type: DataTypes.STRING(20), allowNull: true, field: 'phone' },
      ambulanceContact: { type: DataTypes.STRING(20), allowNull: true },
      phone1: { type: DataTypes.STRING(20), allowNull: true },
      phone2: { type: DataTypes.STRING(20), allowNull: true },
      phone3: { type: DataTypes.STRING(20), allowNull: true },
      pushToken: { type: DataTypes.STRING(255), allowNull: true },
      termsAccepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'termsaccepted' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },
    { tableName: 'seniors',
      indexes: [
        {
          fields: ['email'],
          unique: true
        }
      ]
    }
  );

  return Senior;
};