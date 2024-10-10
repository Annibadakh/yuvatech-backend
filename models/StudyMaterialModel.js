
const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Course = require("./CourseModel.js");

const { DataTypes } = Sequelize;

const StudyMaterial = db.define('studyMaterial', {
    materialId: {
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
    courseId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'course',  // Ensure this matches the table name for Course
            key: 'courseId'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

// StudyMaterial.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
// Course.hasMany(StudyMaterial, { foreignKey: 'courseId', as: 'studyMaterials' });

module.exports = StudyMaterial;
