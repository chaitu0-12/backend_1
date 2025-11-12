const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { createSequelizeInstance } = require('../config/database');

dotenv.config();

const db = createSequelizeInstance();

// Initialize models
const Student = require('./student/Student')(db);
const Senior = require('./senior/Senior')(db);
const OtpToken = require('./common/OtpToken')(db);
const Request = require('./student/Request')(db);
const StudentInterest = require('./student/StudentInterest')(db);
const StudentCertification = require('./student/StudentCertification')(db);
const StudentFeedback = require('./student/StudentFeedback')(db);
const SeniorRequest = require('./senior/SeniorRequest')(db);
const SeniorFeedback = require('./senior/SeniorFeedback')(db);
const Donation = require('./Donation')(db);

// Define associations
// Senior -> SeniorRequest (One-to-Many)
Senior.hasMany(SeniorRequest, { foreignKey: 'seniorId', as: 'requests' });
SeniorRequest.belongsTo(Senior, { foreignKey: 'seniorId', as: 'senior' });

// Student -> SeniorRequest (One-to-Many through assignment)
Student.hasMany(SeniorRequest, { foreignKey: 'assignedStudentId', as: 'assignedRequests' });
SeniorRequest.belongsTo(Student, { foreignKey: 'assignedStudentId', as: 'assignedStudent' });

// SeniorRequest -> SeniorFeedback (One-to-One)
SeniorRequest.hasOne(SeniorFeedback, { foreignKey: 'requestId', as: 'feedback' });
SeniorFeedback.belongsTo(SeniorRequest, { foreignKey: 'requestId', as: 'request' });

// Senior -> SeniorFeedback (One-to-Many)
Senior.hasMany(SeniorFeedback, { foreignKey: 'seniorId', as: 'feedbackGiven' });
SeniorFeedback.belongsTo(Senior, { foreignKey: 'seniorId', as: 'senior' });

// Student -> SeniorFeedback (One-to-Many)
Student.hasMany(SeniorFeedback, { foreignKey: 'studentId', as: 'feedbackReceived' });
SeniorFeedback.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> StudentInterest (One-to-Many)
Student.hasMany(StudentInterest, { foreignKey: 'studentId', as: 'interests' });
StudentInterest.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> StudentCertification (One-to-Many)
Student.hasMany(StudentCertification, { foreignKey: 'studentId', as: 'certifications' });
StudentCertification.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> StudentFeedback (One-to-Many)
Student.hasMany(StudentFeedback, { foreignKey: 'studentId', as: 'studentFeedback' });
StudentFeedback.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

async function connectAndSync() {
  // Ensure database exists before Sequelize connects
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      multipleStatements: true,
    });

    const dbName = process.env.DB_NAME || 'student_senior_db';

    // Ensure database exists (non-destructive)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );

    await connection.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MySQL ensure database error:', err.message);
  }

  await db.authenticate();

  // Safer sync: only create new tables, don't alter existing ones
  await db.sync({ force: false });
  
  // Add missing columns if they don't exist
  try {
    // Check if termsAccepted column exists in students table
    const [studentColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'students' 
      AND COLUMN_NAME = 'termsAccepted'
    `);
    
    // Add termsAccepted column to students table if it doesn't exist
    if (studentColumns.length === 0) {
      await db.query(`
        ALTER TABLE students 
        ADD COLUMN termsAccepted BOOLEAN NOT NULL DEFAULT FALSE
      `);
      console.log('Added termsAccepted column to students table');
    }
    
    // Check if termsAccepted column exists in seniors table
    const [seniorColumns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'seniors' 
      AND COLUMN_NAME = 'termsAccepted'
    `);
    
    // Add termsAccepted column to seniors table if it doesn't exist
    if (seniorColumns.length === 0) {
      await db.query(`
        ALTER TABLE seniors 
        ADD COLUMN termsAccepted BOOLEAN NOT NULL DEFAULT FALSE
      `);
      console.log('Added termsAccepted column to seniors table');
    }

    // Ensure senior_feedback has servicesNeeded and featuresNeeded columns
    try {
      const [feedbackCols] = await db.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'senior_feedback'
      `);

      const colNames = feedbackCols.map(c => c.COLUMN_NAME);
      if (!colNames.includes('servicesNeeded')) {
        await db.query(`ALTER TABLE senior_feedback ADD COLUMN servicesNeeded TEXT NULL`);
        console.log('Added servicesNeeded column to senior_feedback table');
      }
      if (!colNames.includes('featuresNeeded')) {
        await db.query(`ALTER TABLE senior_feedback ADD COLUMN featuresNeeded TEXT NULL`);
        console.log('Added featuresNeeded column to senior_feedback table');
      }
    } catch (innerErr) {
      // If senior_feedback table doesn't exist yet, sync will create it later
      // Log and continue
      console.log('senior_feedback column check skipped:', innerErr.message);
    }
    
    console.log('Database schema updated successfully');
  } catch (err) {
    console.error('Error updating database schema:', err.message);
  }
}

module.exports = {
  sequelize: db,
  Student,
  Senior,
  OtpToken,
  Request,
  StudentInterest,
  StudentCertification,
  StudentFeedback,
  SeniorRequest,
  SeniorFeedback,
  Donation,
  connectAndSync,
};

