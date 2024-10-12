// models/BlogModel.js
const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const Blog = db.define('blog', {
    blogId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: () => Math.random().toString(36).substring(2, 9),
        validate: {
            len: [6, 7]
        }
    },
    title: {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    photo: {
        type: DataTypes.STRING, // Store photo URL or path
        allowNull: true,
        
    }
}, {
    freezeTableName: true
});

module.exports = Blog;
