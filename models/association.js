const Student = require('./StudentModel.js');
const Enrollment = require('./EnrollmentModel.js');
const Course = require('./CourseModel.js');
const StudyMaterial = require('./StudyMaterialModel.js');
const Payments = require('./PaymentModel.js');
const StudentCred = require('./StudentCredentials.js');

function associateModels() {
    // Define associations between models
    Enrollment.hasMany(Payments, { foreignKey: 'enrollmentId' });
    Payments.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

    Student.hasMany(Enrollment, { foreignKey: 'studentId' });
    Enrollment.belongsTo(Student, { foreignKey: 'studentId' });

    Course.hasMany(Enrollment, { foreignKey: 'courseId' });
    Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

    Enrollment.belongsTo(StudentCred, { foreignKey: 'studentId' });

    Course.hasMany(StudyMaterial, { foreignKey: 'courseId' });
    StudyMaterial.belongsTo(Course, { foreignKey: 'courseId' });
}

module.exports = associateModels;
