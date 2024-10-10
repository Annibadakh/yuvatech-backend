// // const { Sequelize } = require("sequelize");
// // const db = require("../config/Database.js");

// // const { DataTypes } = Sequelize;

// // const Student = db.define('student', {
// //     studentId: {
// //         type: DataTypes.STRING,
// //         primaryKey: true,
// //         allowNull: false,
// //         unique: true,
// //         defaultValue: function () {
// //             // Generate a random string of length 6 to 7 characters
// //             const randomString = Math.random().toString(36).substring(2, 9);
// //             return randomString;
// //         },
// //         validate: {
// //             // Validate the length of the UUID
// //             len: [6, 7]
// //         }
// //     },
// //     firstName: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     middleName: {
// //         type: DataTypes.STRING,
// //         allowNull: true
// //     },
// //     lastName: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     mobile: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     email: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         unique: true
// //     },
// //     dob: {
// //         type: DataTypes.DATEONLY,
// //         allowNull: false
// //     },
// //     city: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     state: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     pincode: {
// //         type: DataTypes.STRING,
// //         allowNull: false
// //     },
// //     occupation: {
// //         type: DataTypes.STRING,
// //         allowNull: true
// //     },
// //     address: {
// //         type: DataTypes.TEXT,
// //         allowNull: false
// //     },
// //     gender: {
// //         type: DataTypes.ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
// //         allowNull: false
// //     },
// //     identityNo: {
// //         type: DataTypes.STRING, // Adjust data type according to identity number format
// //         allowNull: true // or false if it's required
// //     },
// //     identityImage: {
// //         type: DataTypes.STRING, // Assuming storing path to the image
// //         allowNull: true // or false if it's required
// //     },
// //     photo: {
// //         type: DataTypes.STRING, // Assuming storing path to the photo
// //         allowNull: true // or false if it's required
// //     },
// //     identityType: {
// //         type: DataTypes.ENUM('Driving License', 'Aadhaar Card', 'Pan Card', 'Voter ID', 'College ID', 'Other'),
// //         allowNull: true // or false if it's required
// //     },
// //     createdBy:{
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //         validate:{
// //             notEmpty: false
// //         }
// //     },
// //     createdByName:{
// //         type: DataTypes.STRING,
// //         allowNull: true,
// //     }
// // }, {
// //     freezeTableName: true
// // });

// // module.exports = Student;
// const { Sequelize } = require("sequelize");
// const db = require("../config/Database.js");

// const { DataTypes } = Sequelize;

// const Student = db.define('student', {
//     studentId: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         allowNull: false,
//         unique: true,
//         defaultValue: function () {
//             // Generate a random string of length 6 to 7 characters
//             const randomString = Math.random().toString(36).substring(2, 9);
//             return randomString;
//         },
//         validate: {
//             // Validate the length of the UUID
//             len: [6, 7]
//         }
//     },
//     firstName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     middleName: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     mobile: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     dob: {
//         type: DataTypes.DATEONLY,
//         allowNull: false
//     },
//     city: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     state: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     pincode: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     occupation: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     address: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     gender: {
//         type: DataTypes.ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
//         allowNull: false
//     },
//     identityNo: {
//         type: DataTypes.STRING, // Adjust data type according to identity number format
//         allowNull: true // or false if it's required
//     },
//     identityImage: {
//         type: DataTypes.STRING, // Assuming storing path to the image
//         allowNull: true // or false if it's required
//     },
//     photo: {
//         type: DataTypes.STRING, // Assuming storing path to the photo
//         allowNull: true // or false if it's required
//     },
//     identityType: {
//         type: DataTypes.ENUM('Driving License', 'Aadhaar Card', 'Pan Card', 'Voter ID', 'College ID', 'Other'),
//         allowNull: true // or false if it's required
//     },
//     createdBy: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: false
//         }
//     },
//     createdByName: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     courseIds: {
//         type: DataTypes.JSON, // Using JSON type to store an array of course IDs
//         allowNull: false,
//         defaultValue: []
//     }
// }, {
//     freezeTableName: true
// });

// module.exports = Student;
const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Student = db.define('student', {
    studentId: {
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
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alternatemobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
 
    addressLine1: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    taluka: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
        allowNull: false
    },
    identityNo: {
        type: DataTypes.STRING, // Adjust data type according to identity number format
        allowNull: true // or false if it's required
    },
    identityImage: {
        type: DataTypes.STRING, // Assuming storing path to the image
        allowNull: true // or false if it's required
    },
    photo: {
        type: DataTypes.STRING, // Assuming storing path to the photo
        allowNull: true // or false if it's required
    },
    identityType: {
        type: DataTypes.ENUM('Driving License', 'Aadhaar Card', 'Pan Card', 'Voter ID', 'College ID', 'Other'),
        allowNull: true // or false if it's required
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
    },
    courseIds: {
        type: DataTypes.JSON, // Using JSON type to store an array of course IDs
        allowNull: false,
        defaultValue: []
    }
}, {
    freezeTableName: true
});
(async () => {
    await db.sync({  });
    console.log('Database synced with force: true');
})();
module.exports = Student;
