"use strict";
module.exports = function (sequelize, DataTypes) {
    var Problem = sequelize.define("Problem", {
        /**
         序号
         组别(项目管理/需求分析设计/版本开发/数据割接/系统集成/系统测试)
         关联任务编号
         产生日期
         期望解决日期
         最晚解决日期
         内部/外部
         类别(问题/风险/求助)
         优先级(H/M/L)
         问题/风险/求助描述
         解决方案
         进展及结果
         状态(close/open/pending)
         问题提出人
         处理责任人
         现场监控责任人
         备注
         */

        index:DataTypes.STRING,
// groupType:DataTypes.ENUM
    //组别(项目管理/需求分析设计/版本开发/数据割接/系统集成/系统测试)

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
    return Problem;
};