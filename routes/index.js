var models = require('../models');
var express = require('express');
const users = require('../model/users');
var _ = require("underscore");
var xlsx = require("node-xlsx");
var util = require('util');
var router = express.Router();
var multiparty = require('multiparty');
var sequelize = require("sequelize");
var moment = require("moment");
var Backbone = require("backbone");
// var ccap = require('ccap');//Instantiated ccap class
// const captcha = ccap({
//     width: 90,//set width,default is 256
//     height: 40,//set height,default is 60
//     offset: 21,//set text spacing,default is 40
//     quality: 100,//set pic quality,default is 50
//     fontsize: 36,//set font size,default is 57
//
//     generate: function () {//Custom the function to generate captcha text
//         var rdmString = "";
//         for (; rdmString.length < 4; rdmString += Math.random().toString(24).substr(2)) ;
//         return rdmString.substr(0, 4);
//     }
// });

const provinces = require("../model/province");
const dutyModel = require("../model/duty");
const monitorModel = require("../model/monitor");

const Form = multiparty.Form;
const TaskModel = Backbone.Model.extend({});
const ProblemModel = Backbone.Model.extend({});

const TaskCollection = Backbone.Collection.extend({
    model: TaskModel
});

const ProblemCollection = Backbone.Collection.extend({
    model: ProblemModel
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


router.get("/base64", function (req, res, next) {
    // var captchaData = captcha.get();
    // req.session.base64 = captchaData[0];
    // res.send(captchaData[1].toString("base64"));
});


/* AJAX handle*/
router.get('/ajax', function (req, res, next) {
    if (!req.session.user) {                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录";
        res.redirect("/ngwf/login.html");                //未登录则重定向到 /login 路径
        return;
    }
    // models.Task.findAll
    var province = req.query["province"];
    var timeTaskResult;
    var infoTaskResult;
    var infoProblemResult;

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
                'plannedStartTime', 'plannedEndTime', 'actualStartTime', 'actualEndTime', "responsiblePerson", "updatedAt"]
        })
    }).then(function (result) {
        infoTaskResult = result;
    }).then(function () {
        return models.Problem.findAll({
            attributes: ["province", "taskId", "problemDate", "expectedResolutionDate", "describe", "questioner", "responsible", "updatedAt"]
        })
    }).then(function (result) {
        infoProblemResult = result;
        var taskCollection = new TaskCollection();
        var problemCollection = new ProblemCollection();

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
        infoProblemResult.forEach(function (Problem) {
            var province = Problem.province;
            var taskId = Problem.taskId;
            var problemDate = Problem.problemDate;
            var expectedResolutionDate = Problem.expectedResolutionDate;
            var describe = Problem.describe;
            var questioner = Problem.questioner;
            var responsible = Problem.responsible;
            var updatedAt = Problem.updatedAt;
            var sameDay = moment().format("YYYY-MM-DD") === moment(updatedAt).format("YYYY-MM-DD");
            console.log(sameDay);
            problemCollection.push({
                province: province,
                taskId: taskId,
                problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : "",
                expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : "",
                describe: describe,
                questioner: questioner,
                responsible: responsible,
                sameDay: sameDay
            });
        });

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
                var taskId = json["taskId"];
                var tempProblem = problemCollection.where({province: cityCode, taskId: taskId});
                json["problem"] = {
                    "detail": []
                };
                _.each(tempProblem, function (Problem) {
                    Problem.set({step: json.step || ""});
                    json["problem"]["detail"].push(Problem.toJSON());
                });

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

            var problems = [];
            var provinceProblem = problemCollection.where({province: cityCode});
            _.each(provinceProblem, function (Problem) {
                problems.push(Problem.toJSON());
            });
            projectInfo.push({
                province: cityCode,
                name: cityName,
                value: weight.toFixed(1),
                rate: weight.toFixed(1),
                duty: dutyModel[cityCode] || "",//写死的后面改成
                monitor: monitorModel[cityCode] || "",//写死的后面改成
                phases: phases,
                problems: problems,
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
    if (!req.session.user) {                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录";
        res.redirect("/login");                //未登录则重定向到 /login 路径
        return;
    }
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
            res.send({code: 1, message: '省份编码为空'});
            return;
        }

        res.send({code: 0, message: '已经完成导入'});//并不完美

        var workbook = xlsx.parse(filepath);
        models.Task.destroy({'where': {'province': province}});
        models.Problem.destroy({'where': {'province': province}});

        workbook.forEach(function (sheet, index) {
            var name = sheet.name;
            var rows = sheet.data;

            function handleDate(excelDate) {
                if (_.isNumber(excelDate)) {
                    return new Date(1990, 0, excelDate);
                } else {
                    return undefined;
                }
            }

            if (index === 0) {

                //计划日报（主计划每日更新）
                rows.forEach(function (row, index) {
                    if (index >= 2) {//从第二行开始
                        if (_.isEmpty(row)) {
                            return;
                        }
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
                rows.forEach(function (row, index) {
                    if (index >= 3) {//从第三行开始
                        if (_.isEmpty(row)) {
                            return;
                        }
                        var index = row[0];//序号
                        var groupType = row[1];//组别(项目管理/需求分析设计/版本开发/数据割接/系统集成/系统测试)
                        var taskId = row[2];//关联任务编号
                        var problemDate = handleDate(row[3]);
                        var expectedResolutionDate = handleDate(row[4]);
                        var theLatestSettlementDate = handleDate(row[5]);
                        var innerOuter = row[6];
                        var subjectType = row[7];
                        var priority = row[8];
                        var describe = row[9];
                        var solution = row[10];
                        var progressAndResults = row[11];
                        var state = row[12];
                        var questioner = row[13];
                        var responsible = row[14];
                        var monitor = row[15];
                        var remark = row[16];

                        models.Problem.create({
                            province: province,
                            index: index,
                            groupType: groupType,
                            taskId: taskId,
                            problemDate: problemDate,
                            expectedResolutionDate: expectedResolutionDate,
                            theLatestSettlementDate: theLatestSettlementDate,
                            innerOuter: innerOuter,
                            subjectType: subjectType,
                            priority: priority,
                            describe: describe,
                            solution: solution,
                            progressAndResults: progressAndResults,
                            state: state,
                            questioner: questioner,
                            responsible: responsible,
                            monitor: monitor,
                            remark: remark
                        });
                    }
                });
            }
        });
    });
});

const findUser = function (name, password) {
    return users.find(function (item) {
        return item.name === name && item.password === password;
    });
};

const findUserProvince = function (name) {
    return users.find(function (item) {
        return item.name === name;
    });
};

// router.get('/taskInfo', function (req, res, next) {
//     var session = req.session;
//     if (_.isString(session.user)) {
//         var user = findUserProvince(session.user);
//         if (user) {
//             var province = user.province;
//             models.Task.findAll({
//                 attributes: ["province", 'progress', 'weight', 'step', 'event', 'taskId', 'parentTaskId',
//                     'plannedStartTime', 'plannedEndTime', 'actualStartTime', 'actualEndTime', "responsiblePerson", "updatedAt"]
//             }).then(function (result) {
//                 console.log(result);
//             });
//             // console.log(province);
//         }
//     }
// });

router.get('/taskInfo', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var infoTaskResult;
            var taskCollection = new TaskCollection();
            models.Task.findAll({
                attributes: [
                    "id",
                    "step",
                    "progress",
                    "responsiblePerson",
                    "plannedStartTime",
                    "plannedEndTime",
                    "province"
                ],
                where: {
                    province: province
                }
            }).then(function (result) {
                result.forEach(function (Task) {
                    var id = Task.id;
                    var step = Task.step;
                    var progress = Task.progress;
                    var responsiblePerson = Task.responsiblePerson;
                    var plannedStartTime = Task.plannedStartTime;
                    var plannedEndTime = Task.plannedEndTime;
                    var province = Task.province;
                    taskCollection.push({
                        id: id,
                        step: step,
                        progress: progress,
                        progressPercent: (progress * 100 + "%"),
                        responsiblePerson: responsiblePerson,
                        plannedStartTime: plannedStartTime ? moment(plannedStartTime).format("YYYY-MM-DD") : "",
                        plannedEndTime: plannedEndTime ? moment(plannedEndTime).format("YYYY-MM-DD") : "",
                        province: province
                    })
                });
                res.send({
                    code: 0,
                    msg: "",
                    count: taskCollection.length,
                    data: taskCollection.toJSON()
                });
            });
        }
    }
});

router.post('/submitTask', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var id = req.body.id;
            var value = req.body.value;
            var field = req.body.field;
            var param = {};
            param[field] = value;
            models.Task.update(
                param, {
                    'where': {'id': id}
                }
            );
        }
    }
});

router.get('/problemInfo', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var infoProblemResult;
            var problemCollection = new ProblemCollection();
            models.Problem.findAll({
                attributes: [
                    "id",
                    "province",
                    "index",
                    "groupType",
                    "taskId",
                    "problemDate",
                    "expectedResolutionDate",
                    "theLatestSettlementDate",
                    "innerOuter",
                    "subjectType",
                    "priority",
                    "describe",
                    "solution",
                    "progressAndResults",
                    "state",
                    "questioner",
                    "responsible",
                    "monitor",
                    "remark"],
                where: {
                    province: province
                }
            }).then(function (result) {
                infoProblemResult = result;
                console.log(result);
                infoProblemResult.forEach(function (Problem) {
                    var id = Problem.id;
                    var index = Problem.index;
                    var groupType = Problem.groupType;
                    var taskId = Problem.taskId;
                    var problemDate = Problem.problemDate;
                    var expectedResolutionDate = Problem.expectedResolutionDate;
                    var theLatestSettlementDate = Problem.theLatestSettlementDate;
                    var innerOuter = Problem.innerOuter;
                    var subjectType = Problem.subjectType;
                    var priority = Problem.priority;
                    var describe = Problem.describe;
                    var solution = Problem.solution;
                    var progressAndResults = Problem.progressAndResults;
                    var state = Problem.state;
                    var questioner = Problem.questioner;
                    var responsible = Problem.responsible;
                    var monitor = Problem.monitor;
                    var remark = Problem.remark;
                    problemCollection.push({
                        id: id,
                        province: province,
                        index: index,
                        groupType: groupType,
                        taskId: taskId,
                        problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : "",
                        expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : "",
                        theLatestSettlementDate: theLatestSettlementDate ? moment(theLatestSettlementDate).format("YYYY-MM-DD") : "",
                        innerOuter: innerOuter,
                        subjectType: subjectType,
                        priority: priority,
                        describe: describe,
                        solution: solution,
                        progressAndResults: progressAndResults,
                        state: state,
                        questioner: questioner,
                        responsible: responsible,
                        monitor: monitor,
                        remark: remark
                    });
                });

                res.send({
                    code: 0,
                    msg: "",
                    count: problemCollection.length,
                    data: problemCollection.toJSON()
                });

            });
            // console.log(province);
        }

    }
});


router.post('/submitProblem', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var index = req.body.index;
            var groupType = req.body.groupType;
            var taskId = req.body.taskId;
            var problemDate = req.body.problemDate;
            var expectedResolutionDate = req.body.expectedResolutionDate;
            var theLatestSettlementDate = req.body.theLatestSettlementDate;
            var innerOuter = req.body.innerOuter;
            var subjectType = req.body.subjectType;
            var priority = req.body.priority;
            var describe = req.body.describe;
            var solution = req.body.solution;
            var progressAndResults = req.body.progressAndResults;
            var state = req.body.state;
            var questioner = req.body.questioner;
            var responsible = req.body.responsible;
            var monitor = req.body.monitor;
            var remark = req.body.remark;
            models.Problem.create({
                province: province,
                index: index,
                groupType: groupType,
                taskId: taskId,
                problemDate: problemDate ? problemDate : "",
                expectedResolutionDate: expectedResolutionDate ? expectedResolutionDate : "",
                theLatestSettlementDate: theLatestSettlementDate ? theLatestSettlementDate : "",
                innerOuter: innerOuter,
                subjectType: subjectType,
                priority: priority,
                describe: describe,
                solution: solution,
                progressAndResults: progressAndResults,
                state: state,
                questioner: questioner,
                responsible: responsible,
                monitor: monitor,
                remark: remark
            }).then(function () {
                res.send({code: 0, message: ''});
            });
        }
    }

});
router.post('/login', function (req, res, next) {
    var session = req.session;
    // if (req.session.base64 === undefined) {
    //     res.json({code: 3, message: '验证码错误'});
    //     return;
    // }
    // if (req.body.validate !== req.session.base64) {
    //     req.session.base64 = undefined;
    //     res.json({code: 3, message: '验证码错误'});
    //     return;
    // }
    var user = findUser(req.body.username, req.body.password);
    if (user) {
        session.regenerate(function (err) {
            if (err) {
                return res.json({code: 2, message: '登录失败'});
            }
            req.session.user = user.name;
            res.json({code: 0, message: '登录成功'});
        });
    } else {
        res.json({code: 1, message: '账号或密码错误'});
    }
});

module.exports = router;
