const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const User = require("./UserModel.js");
const StudyMaterial = require("./StudyMaterialModel.js");
const Enrollment = require("./EnrollmentModel.js");

const Courses = db.define('course', {
    courseId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: function () {
            // Generate a random string of length 6 to 7 characters
            const randomString = Math.random().toString(36).substring(2, 9);
            return randomString;
        },
        validate: {
            // Validate the length of the UUID
            len: [6, 7]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: false
        }
    },
    examFees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    courseFees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: false
        }
    },
    createdByName: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

Courses.hasMany(StudyMaterial, { foreignKey: 'courseId' });
Courses.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Courses, { foreignKey: 'courseId' });

module.exports = Courses;
