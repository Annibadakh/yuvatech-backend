const User = require("../models/UserModel.js");
const Student = require("../models/StudentCredentials.js");

exports.verifyUser = async (req, res, next) => {
    if (!req.session.userId && !req.session.studentId) {
        return res.status(401).json({ msg: "Please log in to your account!" });
    }
    
    let user;

    if (req.session.userId) {
        user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
    } else if (req.session.studentId) {
        // If a student is logged in
        user = await Student.findOne({
            where: {
                studentId: req.session.studentId
            }
        });
    }

    if (!user) return res.status(404).json({ msg: "User or student not found" });
    
    req.user = user;
    next();
};

exports.checkRole = (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "user") {
        return res.status(403).json({ msg: "Forbidden access" });
    }
    next();
};

exports.adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user || user.role !== "admin") {
        return res.status(403).json({ msg: "Access forbidden" });
    }
    next();
};

exports.extractCurrentUser = (req, res, next) => {
    if (req.session && req.session.studentId) {
        req.studentId = req.session.studentId; 
    } else {
        req.studentId = null;
    }
    next();
};
