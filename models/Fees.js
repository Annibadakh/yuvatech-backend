// const { Sequelize, DataTypes } = require("sequelize");
// const db = require("../config/Database.js");
// const Enrollment = require("./EnrollmentModel.js");
// const Courses = require("./CourseModel.js");

// const Fees = db.define('fees', {
//     feeId: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         allowNull: false,
//         unique: true,
//         defaultValue: function () {
//             const randomString = Math.random().toString(36).substring(2, 9);
//             return randomString;
//         },
//         validate: {
//             len: [6, 7]
//         }
//     },
//     enrollmentId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: Enrollment,
//             key: 'enrollmentId'
//         }
//     },
//     totalFees: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     },
//     discount: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         defaultValue: 0
//     },
//     applicableFees: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     }
// }, {
//     freezeTableName: true
// });

// // Define a method to calculate totalFees based on courseFees and examFees
// Fees.calculateTotalFees = async function(courseId) {
//     const course = await Courses.findOne({ where: { courseId } });
//     if (course) {
//         return course.courseFees + course.examFees;
//     } else {
//         throw new Error('Course not found');
//     }
// };

// Enrollment.hasOne(Fees, { foreignKey: 'enrollmentId' });
// Fees.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

// module.exports = Fees;

const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const Enrollment = require("./EnrollmentModel.js");
const Courses = require("./CourseModel.js");

const Fees = db.define('fees', {
    feeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: function () {
            const randomString = Math.random().toString(36).substring(2, 9);
            return randomString;
        },
        validate: {
            len: [6, 7]
        }
    },
    enrollmentId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Enrollment,
            key: 'enrollmentId'
        }
    },
    totalFees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    applicableFees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    balanceAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: function() {
            return this.applicableFees; // Initially set to applicableFees
        }
    },
    duedate: {
        type: DataTypes.DATEONLY,
        allowNull: true // Allow null if dueDate is optional
    }
}, {
    freezeTableName: true
});

// Hook to set balanceAmount before creating a new record
Fees.beforeCreate(async (fees) => {
    fees.balanceAmount = fees.applicableFees;
});

// Define a method to calculate totalFees based on courseFees and examFees
Fees.calculateTotalFees = async function(courseId) {
    const course = await Courses.findOne({ where: { courseId } });
    if (course) {
        return course.courseFees + course.examFees;
    } else {
        throw new Error('Course not found');
    }
};

Enrollment.hasOne(Fees, { foreignKey: 'enrollmentId' });
Fees.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

module.exports = Fees;
