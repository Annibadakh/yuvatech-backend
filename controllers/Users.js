
const User = require('../models/UserModel.js'); // Assuming your User model is exported as User
const { uploadimage } = require("../middleware/FileUpload.js"); 
const argon2 = require('argon2');
const { Op } = require('sequelize');

// const createUser = async (req, res) => {
//     // Handle file upload using Multer middleware
//     uploadimage(req, res, async function (err) {
//         if (err) {
//             console.error("Multer error:", err);
//             return res.status(500).json({ message: err.message });
//         }

//         // Check if the photo file is uploaded
//         if (!req.files || !req.files['image']) {
//             return res.status(400).json({ message: "Image is required" });
//         }

//         const { name, email, password, confPassword,gender, role, addressLine1, addressLine2,pincode, city, state, district, country, taluka, mobileNumber,dob,occupation,alternatemobile } = req.body;
//         const createdBy = req.user.uuid;

//         // Validate password and confirm password match
//         if (password !== confPassword) {
//             return res.status(400).json({ msg: "Password and Confirm Password do not match" });
//         }

//         try {
//             const hashPassword = await argon2.hash(password);

//             // Log the uploaded photo path
//             console.log("Photo path:", req.files['image'][0].path);

//             // Create the user and store the photo path in the database
//             const user = await User.create({
//                 name,
//                 email,
//                 password: hashPassword,
//                 role,
//                 createdBy,
//                 addressLine1,
//                 addressLine2,
//                 occupation,
//                 alternatemobile,
//                 city,
//                 pincode,
//                 state,
//                 district,
//                 country,
//                 taluka,
//                 mobileNumber,
//                 photo: req.files['image'][0].path, // Store the photo path
//                 // copyofpassword: password,
//                 gender,
//                 dob
//             });

//             console.log("User created successfully:", user);

//             res.status(201).json({ msg: "User created successfully", user });
//         } catch (error) {
//             console.error("Failed to create user:", error);
//             res.status(400).json({ msg: error.message });
//         }
//     });
// };

const createUser = async (req, res) => {
    // Handle file upload using Multer middleware
    uploadimage(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: err.message });
        }

        const { name, email, password, confPassword, gender, role, addressLine1, addressLine2, pincode, city, state, district, country, taluka, mobileNumber, dob, occupation, alternatemobile } = req.body;
        const createdBy = req.user.uuid;

        // Validate password and confirm password match
        if (password !== confPassword) {
            return res.status(400).json({ msg: "Password and Confirm Password do not match" });
        }

        try {
            const hashPassword = await argon2.hash(password);

            // Check if an image was uploaded and log the photo path if it exists
            let photoPath = null;
            if (req.files && req.files['image']) {
                photoPath = req.files['image'][0].path;
                console.log("Photo path:", photoPath);
            }

            // Create the user and store the photo path in the database (if uploaded)
            const user = await User.create({
                name,
                email,
                password: hashPassword,
                role,
                createdBy,
                addressLine1,
                addressLine2,
                occupation,
                alternatemobile,
                city,
                pincode,
                state,
                district,
                country,
                taluka,
                mobileNumber,
                photo: photoPath, // Store the photo path (null if not uploaded)
                gender,
                dob
            });

            console.log("User created successfully:", user);

            res.status(201).json({ msg: "User created successfully", user });
        } catch (error) {
            console.error("Failed to create user:", error);
            res.status(400).json({ msg: error.message });
        }
    });
};




const getUsers = async (req, res) => {
    try {
        let whereClause = {};
        
        if (req.user && req.user.role) {
            if (req.user.role !== 'admin') {
                // If not admin, filter by `createdBy` and `role: student`
                whereClause = {
                    createdBy: req.user.uuid,
                    role: 'student'
                };
            }
        }

        // Always exclude the current user
        whereClause.uuid = { [ Op.ne]: req.user.uuid };
        
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role', 'createdAt'],
            where: whereClause
        });
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role', 'createdBy','addressLine1','addressLine2','city','pincode','state','district','country','taluka','mobileNumber','photo','gender','dob','createdAt'],
            // attributes: ['uuid', 'name', 'email', 'role', 'createdBy','addressLine1','addressLine2','city','pincode','state','district','country','taluka','mobileNumber','photo','copyofpassword','gender','dob','createdAt'],
            where: {
                uuid: req.params.id
            }
        });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        if (req.user.role !== 'admin' && user.createdBy !== req.user.uuid) {
            return res.status(403).json({ msg: "You are not authorized to access this user" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// const updateUser = async (req, res) => {
//     try {
//         const user = await User.findOne({
//             where: {
//                 uuid: req.params.id
//             }
//         });
        
//         if (!user) {
//             return res.status(404).json({ msg: "User not found" });
//         }
        
//         if (req.user.role !== 'admin' && user.createdBy !== req.user.uuid) {
//             return res.status(403).json({ msg: "You are not authorized to update this user" });
//         }
        
//         const { name, email, role, password } = req.body;
        
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.role = role || user.role;

//         if (password) {
//             const hashPassword = await argon2.hash(password);
//             user.password = hashPassword;
//         }

//         await user.save();
        
//         res.status(200).json({ msg: "User Updated" });
//     } catch (error) {
//         res.status(400).json({ msg: error.message });
//     }
// };

// const updateUser = async (req, res) => {
//     try {
//         const user = await User.findOne({
//             where: {
//                 uuid: req.params.id
//             }
//         });
        
//         if (!user) {
//             return res.status(404).json({ msg: "User not found" });
//         }
        
//         if (req.user.role !== 'admin' && user.createdBy !== req.user.uuid) {
//             return res.status(403).json({ msg: "You are not authorized to update this user" });
//         }
        
//         const { name, email, role, password,mobileNumber,addressLine1,addressLine2,state,city,taluka,country } = req.body;
        
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.role = role || user.role;
//         user.mobileNumber = mobileNumber || user.mobileNumber;
//         user.addressLine1 = addressLine1 || user.addressLine1;
//         user.addressLine2 = addressLine2 || user.addressLine2;
//         user.state = state || user.state;
//         user.city = city || user.city;
//         user.taluka = taluka || user.taluka;
//         user.country = country || user.country;
        

//         if (password) {
//             const hashPassword = await argon2.hash(password);
//             user.password = hashPassword;
//             user.copyofpassword = password;  // Update the copy of the password
//         }

//         await user.save();
        
//         res.status(200).json({ msg: "User Updated" });
//     } catch (error) {
//         res.status(400).json({ msg: error.message });
//     }
// };

const updateUser = async (req, res) => {
    // Handle file upload using Multer middleware
    uploadimage(req, res, async function (err) {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: err.message });
        }

        try {
            // Find the user by UUID
            const user = await User.findOne({
                where: {
                    uuid: req.params.id
                }
            });

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            // Check if the current user is authorized to update this user
            if (req.user.role !== 'admin' && user.createdBy !== req.user.uuid) {
                return res.status(403).json({ msg: "You are not authorized to update this user" });
            }

            // Destructure the fields from the request body
            const { name, email, role, password, confPassword, mobileNumber, addressLine1, addressLine2, state, city,pincode, taluka, country ,dob} = req.body;

            // Check if password and confirm password match
            if (password && confPassword && password !== confPassword) {
                console.log('password and confirm password do not match');
                
                return res.status(400).json({ msg: "Password and Confirm Password do not match" });
            }

            // Update the fields if provided, or keep the current values
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
            user.mobileNumber = mobileNumber || user.mobileNumber;
            user.addressLine1 = addressLine1 || user.addressLine1;
            user.addressLine2 = addressLine2 || user.addressLine2;
            user.state = state || user.state;
            user.city = city || user.city;
            user.taluka = taluka || user.taluka;
            user.country = country || user.country;
            user.pincode = pincode || user.pincode;
            user.dob = dob || user.dob;

            // Update the password if provided
            if (password) {
                const hashPassword = await argon2.hash(password);
                user.password = hashPassword;
                // user.copyofpassword = password;  // Update the copy of the password

            }

            // Handle photo upload if a new photo is provided
            if (req.files && req.files['image']) {
                user.photo = req.files['image'][0].path;  // Update the photo path
                console.log("Photo path:", user.photo);
            }

            // Save the updated user to the database
            await user.save();

            res.status(200).json({ msg: "User Updated" });
        } catch (error) {
            console.error("Failed to update user:", error);
            res.status(400).json({ msg: error.message });
        }
    });
};

const getProfile = async (req, res) => {
    try {
        // Retrieve the user ID from the request object (usually added by authentication middleware)
        const userId = req.user.uuid;

        // Find the user by ID
        const user = await User.findOne({
            where: { uuid: userId },
            attributes: ['uuid', 'name', 'email', 'role','dob', 'addressLine1', 'addressLine2', 'city', 'state', 'taluka','pincode', 'country', 'mobileNumber', 'photo','occupation','gender','alternatemobile']
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Return the user profile
        res.status(200).json(user);
    } catch (error) {
        console.error("Failed to get profile:", error);
        res.status(500).json({ msg: error.message });
    }
};



const updateProfile = async (req, res) => {
    try {
        // Find the user by their ID stored in the session or request user object
        const user = await User.findOne({
            where: {
                uuid: req.session.userId || req.user.uuid
            }
        });

        // If the user is not found, return a 404 response
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Handle file upload using Multer middleware
        uploadimage(req, res, async function (err) {
            if (err) {
                console.error("Multer error:", err);
                return res.status(500).json({ message: err.message });
            }

            // Check if the photo file is uploaded (if photo update is required)
            if (req.files && req.files['image']) {
                user.photo = req.files['image'][0].path; // Update the photo path
            }

            // Extract fields from the request body that the user is allowed to update
            const {
                name,
                email,
                occupation,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                district,
                taluka,
                mobileNumber,
                alternatemobile,
                password,
                pincode,
                gender,
                dob
            } = req.body;
        console.log(req.body);
        

            // Update the user's profile with the new values, or retain the old ones if not provided
            user.name = name || user.name;
            user.email = email || user.email;
            user.occupation = occupation || user.occupation;
            user.addressLine1 = addressLine1 || user.addressLine1;
            user.addressLine2 = addressLine2 || user.addressLine2;
            user.city = city || user.city;
            user.state = state || user.state;
            user.country = country || user.country;
            user.district = district || user.district;
            user.taluka = taluka || user.taluka;
            user.mobileNumber = mobileNumber || user.mobileNumber;
            user.pincode = pincode || user.pincode;
            user.gender = gender || user.gender;
            user.dob = dob || user.dob;
            user.alternatemobile = alternatemobile || user.alternatemobile;

            // If a new password is provided, hash it before saving
            if (password) {
                const hashPassword = await argon2.hash(password);
                user.password = hashPassword;
            }

            // Save the updated user information to the database
            await user.save();

            // Send a response indicating that the profile has been updated
            res.status(200).json({ msg: "Profile Updated", user });
        });

    } catch (error) {
        // If an error occurs, log it and send a 500 response with the error message
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// const updateProfile = async (req, res) => {
//     try {
//       // Find the user by their ID stored in the session or request user object
//       const user = await User.findOne({
//         where: {
//           uuid: req.session.userId || req.user.uuid
//         }
//       });
  
//       // If the user is not found, return a 404 response
//       if (!user) {
//         return res.status(404).json({ msg: "User not found" });
//       }
  
//       // Extract fields from the request body that the user is allowed to update
//       const {
//         name,
//         email,
//         addressLine1,
//         addressLine2,
//         city,
//         state,
//         country,
//         district,
//         taluka,
//         mobileNumber,
//         password,
//         pincode
//       } = req.body;
  
//       // Update the user's profile with the new values, or retain the old ones if not provided
//       user.name = name || user.name;
//       user.email = email || user.email;
//       user.addressLine1 = addressLine1 || user.addressLine1;
//       user.addressLine2 = addressLine2 || user.addressLine2;
//       user.city = city || user.city;
//       user.state = state || user.state;
//       user.country = country || user.country;
//       user.district = district || user.district;
//       user.taluka = taluka || user.taluka;
//       user.mobileNumber = mobileNumber || user.mobileNumber;
//       user.pincode = pincode || user.pincode;
  
//       // If a new password is provided, hash it before saving
//       if (password) {
//         const hashPassword = await argon2.hash(password);
//         user.password = hashPassword;
//       }
  
//       // Save the updated user information to the database
//       await user.save();
  
//       // Send a response indicating that the profile has been updated
//       res.status(200).json({ msg: "Profile Updated" });
//     } catch (error) {
//       // If an error occurs, log it and send a 500 response with the error message
//       console.error(error);
//       res.status(500).json({ msg: "Server error" });
//     }
//   };
  
  const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword, confPassword } = req.body;
    const userId = req.user.uuid; // Using the authenticated user's UUID

    try {
        // Fetch the user from the database using the UUID
        const user = await User.findOne({ where: { uuid: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Verify the old password
        const isMatch = await argon2.verify(user.password, oldPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect previous password" });
        }

        // Check if the new password and confirm password match
        if (newPassword !== confPassword) {
            return res.status(400).json({ msg: "New password and confirm password do not match" });
        }

        // Hash the new password
        const hashPassword = await argon2.hash(newPassword);

        // Update the user's password in the database
        user.password = hashPassword;
        // user.copyofpassword = newPassword; // Store the plain text password if needed (Not recommended)
        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        console.error("Failed to update password:", error);
        res.status(500).json({ msg: "Failed to update password" });
    }
};
  
  


const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        if (req.user.role !== 'admin' && user.createdBy !== req.user.uuid) {
            return res.status(403).json({ msg: "You are not authorized to delete this user" });
        }
        
        await User.destroy({
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,updateProfile,getProfile,updateUserPassword
};
