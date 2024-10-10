const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const Payments = require("./PaymentModel.js");
// const Fees =require("./Fees.js");
const Courses = require("./CourseModel.js");
const Student = require("./StudentModel.js");
const User = require("./UserModel.js");

const { DataTypes } = Sequelize;

const Enrollment = db.define('enrollment', {
    enrollmentId: {
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
    studentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enrollmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('enrolled', 'completed', 'dropped'),
        defaultValue: 'enrolled',
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true  // Corrected from `false` to `true`
        }
    },
    createdByName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

Enrollment.hasMany(Payments, { foreignKey: 'enrollmentId' });
Payments.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

Enrollment.belongsTo(Student, { foreignKey: 'studentId' });   
// Enrollment.belongsTo(User, { foreignKey: 'uuid' });   

module.exports = Enrollment;
