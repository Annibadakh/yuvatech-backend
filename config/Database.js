
// const Sequelize = require("sequelize");
// const db = new Sequelize('kyvkvltv_yuvatech', 'kyvkvltv_techtitans', 'Techt!t@ns@0330', {
//     host: "localhost",
//     dialect: "mysql"
// });
 
// module.exports = db;

const Sequelize = require("sequelize");
const db = new Sequelize('yuvatech', 'root', 'Aniket@123', {
    host: "localhost",
    dialect: "mysql"
});
 
module.exports = db;
