"use strict";
module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        province: DataTypes.STRING,
        taskId: DataTypes.STRING,
        parentTaskId: DataTypes.STRING,
        step: DataTypes.STRING(2048),
        event: DataTypes.STRING(2048),
        // progress: DataTypes.ENUM("未开始", "进行中", "完成"),
        progress: DataTypes.FLOAT,
        missionCritical: DataTypes.STRING(2048),
        weight: DataTypes.FLOAT,
        percent: DataTypes.STRING,
        responsiblePerson: DataTypes.STRING,
        // responsiblePerson: DataTypes.ARRAY(DataTypes.STRING),
        timeLimit: DataTypes.STRING,
        plannedStartTime: DataTypes.DATE,
        plannedEndTime: DataTypes.DATE,
        actualStartTime: DataTypes.DATE,
        actualEndTime: DataTypes.DATE,
        deliverable: DataTypes.STRING(2048),
        problemDetail: DataTypes.STRING(4096)
    });
    return Task;
};