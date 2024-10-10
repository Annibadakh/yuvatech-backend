const User = require("../models/UserModel.js");
const Student = require("../models/StudentCredentials.js"); 
const argon2 = require("argon2");

exports.Login = async (req, res) => {
    let user;

    // find the user by email
    user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    // If user not found
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify password
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    // Set session data based on user role
    if (user instanceof User) {
        req.session.userId = user.uuid;
    } else if (user instanceof Student) {
        req.session.studentId = user.studentId;
    }

    // Return user details in the response
    const { uuid, name, email, role } = user;
    res.status(200).json({ uuid, name, email, role });
};


//-----------------OLD-------------
// exports.Me = async (req, res) => {
//     let user;
//     if (req.session.userId) {
//         user = await User.findOne({
//             attributes: ['uuid', 'name', 'email', 'role'],
//             where: {
//                 uuid: req.session.userId
//             }
//         });
//     } else if (req.session.studentId) {
//         user = await Student.findOne({
//             attributes: ['studentId', 'name', 'email'],
//             where: {
//                 studentId: req.session.studentId
//             }
//         });
//     }

//     if (!user) return res.status(404).json({ msg: "User or student not found" });
//     res.status(200).json(user);
// };
exports.Me = async (req, res) => {
    let user;
    try {
        if (req.session.userId) {
            user = await User.findOne({
                attributes: [
                    'uuid', 'name', 'email', 'role', 
                    'addressLine1', 'addressLine2', 'city', 
                    'state', 'country', 'district', 'taluka', 
                    'mobileNumber',
                ],
                where: {
                    uuid: req.session.userId
                }
            });
        } else if (req.session.studentId) {
            user = await Student.findOne({
                attributes: ['studentId', 'name', 'email'], // Adjust these attributes as needed
                where: {
                    studentId: req.session.studentId
                }
            });
        }

        if (!user) {
            return res.status(404).json({ msg: "User or student not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};


exports.logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Unable to logout" });
        res.status(200).json({ msg: "You have been logged out" });
    });
};
