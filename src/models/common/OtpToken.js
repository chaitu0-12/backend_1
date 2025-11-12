const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OtpToken = sequelize.define(
    'OtpToken',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(160), allowNull: false },
      code: { type: DataTypes.STRING(8), allowNull: false },
      purpose: { type: DataTypes.STRING(32), allowNull: false }, // 'reset'
      used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
    },
    { tableName: 'otp_tokens' }
  );

  return OtpToken;
};

