"use strict";
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        province: DataTypes.STRING
    });
    return User;
};