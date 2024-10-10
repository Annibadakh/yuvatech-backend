
// const { Sequelize, DataTypes } = require("sequelize");
// const db = require("../config/Database.js");
// const Courses = require('./CourseModel.js'); 

// const User = db.define('user', {
//     uuid: {
//         type: DataTypes.STRING,
//         defaultValue: DataTypes.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//         validate: {
//             notEmpty: true
//         }
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//             len: [3, 100]
//         }
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//             isEmail: true
//         }
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     },
//     copyofpassword: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     },
//     role: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     },
//     createdBy: {
//         type: DataTypes.UUID,
//         allowNull: true,
//         defaultValue: null
//     }
// }, {
//     freezeTableName: true
// });

// User.hasMany(Courses, { foreignKey: 'createdBy' });
// Courses.belongsTo(User, { foreignKey: 'createdBy' });

// module.exports = User;
const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");
const Courses = require('./CourseModel.js'); 

const User = db.define('user', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // copyofpassword: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     validate: {
    //         notEmpty: true
    //     }
    // },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
    occupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    country: {
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
    taluka: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 100]
        }
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 11]
        }
    },
    alternatemobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING, // Assuming storing path to the photo
        allowNull: true // or false if it's required
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null
    }
}, {
    freezeTableName: true
});

User.hasMany(Courses, { foreignKey: 'createdBy' });
Courses.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = User;
