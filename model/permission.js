"use strict";
/**
 * 是否管理员判断
 * @param user
 * @returns {boolean}
 */
var isAdmin = function (user) {
    return "zhangxin" === user || "admin" === user || "anjun" === user
};
/**
 * 是否督导判断
 * @param user
 * @returns {boolean|*}
 */
var isMonitor = function (user) {
    return "zhangxin" === user || "admin" === user || "anjun" === user || (user && user.startsWith("admin"))
};
module.exports = {
    "isAdmin": isAdmin,
    "isMonitor": isMonitor
};