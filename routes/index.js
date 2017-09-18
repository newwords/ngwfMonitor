var models = require('../models');
var express = require('express');
var _ = require("underscore");
var xlsx = require("node-xlsx");
var util = require('util');
var router = express.Router();
var multiparty = require('multiparty');
var sequelize = require("sequelize");
var moment = require("moment");
var Backbone = require("backbone");
const provinces = require("../model/province");
const duty = require("../model/duty");

const Form = multiparty.Form;
const TaskModel = Backbone.Model.extend({});

const TaskCollection = Backbone.Collection.extend({
    model: TaskModel
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect("ngwf/index.html");
    // res.render('error', {
    //     message: '服务器异常',
    //     error: {
    //         status: "404",
    //         stack: "message"
    //     }
    // });
});


/* AJAX handle*/
router.get('/ajax', function (req, res, next) {
    // models.Task.findAll
    var province = req.query["province"];
    var StartTime;
    var EndTime;

    // models.Task.findAll({
    //     attributes: ["province", 'progress', 'weight', 'taskId', 'parentTaskId']
    // }).then(function (result) {
    //
    //
    //
    // });


    var timeTaskResult;
    var infoTaskResult;

    models.Task.findAll({
        attributes: ["province",
            [sequelize.fn('min', sequelize.col('plannedStartTime')), "plannedStartTime"],
            [sequelize.fn('max', sequelize.col('plannedEndTime')), "plannedEndTime"]
        ],
        group: 'province'
    }).then(function (result) {
        timeTaskResult = result;
    }).then(function () {
        return models.Task.findAll({

            attributes: ["province", 'progress', 'weight', 'step', 'event', 'taskId', 'parentTaskId',
                'plannedStartTime', 'plannedEndTime', 'actualStartTime', 'actualEndTime', "responsiblePerson"]
        })
    }).then(function (result) {
        infoTaskResult = result;
        var taskCollection = new TaskCollection();

        function getWeight(Collection, province, taskId) {
            var result = 0;
            if (Collection.length === 0) {
                return -1;
            }
            _.each(Collection, function (taskModel) {
                var weight = taskModel.get("weight") || 0;
                var progress = taskModel.get("progress") || 0;
                var taskId = taskModel.get("taskId");
                var temp = taskCollection.where({province: province, parentTaskId: taskId});
                var childWeight = getWeight(temp, province, taskModel.get("taskId"));
                if (childWeight === -1) {//无子节点
                    result += (weight * progress)
                } else {
                    result += (weight * childWeight)
                }
            });
            return result;
        }

        var projectInfo = [];
        // for (var key in data.citys) {
        //     projectInfo[key] = {};
        //     projectInfo[key].name = data.citys[key].name;
        //     projectInfo[key].value = +data.citys[key].rate;
        // }

        infoTaskResult.forEach(function (Task) {
            var province = Task.province;
            var progress = Task.progress;
            var weight = Task.weight;

            var taskId = Task.taskId;
            var parentTaskId = Task.parentTaskId || "";
            var plannedStartTime = Task.plannedStartTime;
            var plannedEndTime = Task.plannedEndTime;

            var actualStartTime = Task.actualStartTime;
            var actualEndTime = Task.actualEndTime;

            var responsiblePerson = Task.responsiblePerson || "";
            var step = Task.step || "";
            var event = Task.event || "";

            taskCollection.push({
                province: province,
                progress: progress,
                weight: weight,
                taskId: taskId,
                parentTaskId: parentTaskId,
                plannedStartTime: plannedStartTime ? moment(plannedStartTime).format("YYYY-MM-DD") : "",
                plannedEndTime: plannedEndTime ? moment(plannedEndTime).format("YYYY-MM-DD") : "",

                actualStartTime: actualStartTime ? moment(actualStartTime).format("YYYY-MM-DD") : "",
                actualEndTime: actualEndTime ? moment(actualEndTime).format("YYYY-MM-DD") : "",

                responsiblePerson: responsiblePerson,
                step: step,
                event: event
            });
        });

        var total = 0;
        _.each(provinces, function (cityName, cityCode) {
            var weight = 0;
            var phases = [];
            var tempPhases = taskCollection.where({province: cityCode});
            _.each(tempPhases, function (taskModel) {

                var json = taskModel.toJSON();
                json.progress = json.progress * 100;
                if (json.progress === 0) {
                    json.name = "准备阶段";
                } else if (json.progress === 100) {
                    json.name = "已完成";
                } else {
                    json.name = "进行中";
                }
                if (json.plannedEndTime) {
                    if (!json.actualEndTime && moment().isBefore(json.plannedEndTime)) {
                        // "warn": {
                        //     "detail": [{"message": "配合改造工作延迟"}]
                        // },
                        json["warn"] = {
                            "detail": [
                                {"message": json["event"] || ""}
                            ]
                        }
                    }
                }
                phases.push(json);
            });

            if (cityCode === "00030016" || cityCode === "00030026") {
                weight = 100;
            } else {
                var temp = taskCollection.where({province: cityCode, parentTaskId: ""});
                weight = getWeight(temp, cityCode, "");
                weight = weight > 0 ? 100 * weight : 0;
            }
            projectInfo.push({
                province: cityCode,
                name: cityName,
                value: weight,
                rate: weight,
                duty: duty[cityCode] || "",//写死的后面改成
                phases: phases,
                bgnTime: "计划尚未导入",
                endTime: "计划尚未导入"
            });
            total += weight;
            timeTaskResult.forEach(function (Task) {
                projectInfo.forEach(function (info) {
                    if (info.province === Task.province) {
                        info["bgnTime"] = moment(Task.plannedStartTime).format("YYYY-MM-DD");
                        info["endTime"] = moment(Task.plannedEndTime).format("YYYY-MM-DD");

                    }
                });
            });
        });
        res.send({
            total: (total / 31).toFixed(0),
            citys: projectInfo
        });
    });
    // var plannedEndTime = models.Task.max("plannedStartTime", {
    //     where: {
    //         province: province
    //     }
    // });

});

/* UPLOAD handle*/
router.post('/upload', function (req, res, next) {
    var multiparty = new Form();
    multiparty.on('field', function (name, value) {
        if (name === 'province') {

        }
    });
    multiparty.on('part', function (part) {
        console.log("province:", province);
        res.end("OK");
    });
    multiparty.parse(req, function (err, fields, files) {
        if (err) {
            throw new Error("form is error");
        }
        var filepath = files.file[0].path;
        var province;

        if (_.has(fields, "province")) {
            province = fields.province[0];
        }
        if (_.isEmpty(province)) {
            res.send("OK");
            return;
        }
        var workbook = xlsx.parse(filepath);
        models.Task.destroy({'where': {'province': '0030016'}});//将表内userId等于23的元组删除
        workbook.forEach(function (sheet, index) {
            var name = sheet.name;
            var rows = sheet.data;
            if (index === 0) {

                //计划日报（主计划每日更新）
                rows.forEach(function (row, index) {
                    if (index >= 2) {//从第二行开始
                        var taskId = row[0] + "";//任务编号
                        var parentTaskId = undefined;
                        if (!_.isEmpty(taskId)) {
                            var taskIdSplit = taskId.split(".");
                            parentTaskId = _.initial(taskIdSplit).join(".");
                        }
                        var step = row[1] || row[2];//关键步骤/子步骤
                        var event = row[3];//事件
                        var progress = row[4];//进度
                        //row[5]跳过 状态
                        var missionCritical = row[6];//关键任务
                        var weight = row[7];
                        var percent = row[8];//百分比
                        var responsiblePerson = row[9];//负责人
                        var timeLimit = row[10];//工期 通过计算得到

                        function handleDate(excelDate) {
                            if (_.isNumber(excelDate)) {
                                return new Date(1990, 0, excelDate);
                            } else {
                                return undefined;
                            }
                        }

                        var plannedStartTime = handleDate(row[11]);
                        var plannedEndTime = handleDate(row[12]);
                        var actualStartTime = handleDate(row[13]);
                        var actualEndTime = handleDate(row[14]);

                        var deliverable = row[15];
                        var problemDetail = row[16];
                        // console.log(taskId,
                        //     step,
                        //     event,
                        //     progress,
                        //     missionCritical,
                        //     percent,
                        //     responsiblePerson,
                        //     timeLimit,
                        //     plannedStartTime,
                        //     plannedEndTime,
                        //     actualStartTime,
                        //     actualEndTime,
                        //     deliverable,
                        //     problemDetail
                        // );
                        models.Task.create({
                            province: province,
                            taskId: taskId,
                            parentTaskId: parentTaskId,
                            step: step,
                            event: event,
                            progress: progress,
                            missionCritical: missionCritical,
                            percent: percent,
                            weight: weight,
                            responsiblePerson: responsiblePerson,
                            timeLimit: timeLimit,
                            plannedStartTime: plannedStartTime,
                            plannedEndTime: plannedEndTime,
                            actualStartTime: actualStartTime,
                            actualEndTime: actualEndTime,
                            deliverable: deliverable,
                            problemDetail: problemDetail
                        })
                    }
                });
            } else if (index === 1) {
                //问题日报（风险问题每日更新）


            }
            // console.log(index);
            // console.log(name);
            // console.log(data)
        });
    });
});


module.exports = router;
