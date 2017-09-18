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
        index: DataTypes.STRING,//序号
        groupType: DataTypes.ENUM('项目管理', '需求分析设计',
            '版本开发', '数据割接', '系统集成', '系统测试'), //组别(项目管理/需求分析设计/版本开发/数据割接/系统集成/系统测试)
        province: DataTypes.STRING,//省份编码
        taskId: DataTypes.STRING,//关联任务编号
        problemDate: DataTypes.DATE,//产生日期
        expectedResolutionDate: DataTypes.DATE,//期望解决日期
        theLatestSettlementDate: DataTypes.DATE,//最晚解决日期
        innerOuter: DataTypes.ENUM('内部', '外部'),//内部/外部
        subjectType: DataTypes.ENUM('问题', '风险', '求助'),//类别(问题/风险/求助)
        priority: DataTypes.ENUM('H', 'M', 'L'),//优先级(H/M/L)
        describe: DataTypes.STRING(4096), //问题/风险/求助描述
        solution: DataTypes.STRING(4096),//解决方案
        progressAndResults: DataTypes.STRING(4096),//进展及结果
        state: DataTypes.ENUM('close', 'open', 'pending'),
        questioner: DataTypes.STRING,
        responsible: DataTypes.STRING,
        monitor: DataTypes.STRING,
        remark: DataTypes.STRING(4096)
    });
    return Problem;
};