var models = require('../models');
var fs = require('fs');
var express = require('express');
const users = require('../model/users');
const provinceInfos = require('../model/province');
var generatePassword = require("password-generator");
var _ = require("underscore");
var _string = require("underscore.string");
var xlsx = require("node-xlsx");
var util = require('util');
var router = express.Router();
var multiparty = require('multiparty');
var sequelize = require("sequelize");
var moment = require("moment");
var Backbone = require("backbone");
const exportsProivce = require("../model/exportsProivce");
const exportsMonitor = require("../model/exportsMonitor");
const space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
router.post('/ajax', function (req, res, next) {
    if (!req.session.user) { //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录";
        res.redirect("/ngwf/login.html"); //未登录则重定向到 /login 路径
        return;
    }
    // models.Task.findAll
    // var province = req.query["province"];
    var timeTaskResult;
    var infoTaskResult;
    var infoProblemResult;

    var hasProvince = false;
    var _province;
    if (_.has(req.body, "province")) {
        if ("main" === req.body.province) {
            if (!req.session.user) { //到达/home路径首先判断是否已经登录
                req.session.error = "请先登录";
                res.redirect("/ngwf/login.html"); //未登录则重定向到 /login 路径
                return;
            }
            if (_.isString(req.session.user)) {
                var user = findUserProvince(req.session.user);
                if (user) {
                    hasProvince = true;
                    _province = user.province;
                }
            }
        }
    }
    var taskTimeQueryParam = {
        attributes: ["province",
            [sequelize.fn('min', sequelize.col('plannedStartTime')), "plannedStartTime"],
            [sequelize.fn('max', sequelize.col('plannedEndTime')), "plannedEndTime"]
        ],
        group: 'province'
    };

    var taskInfoQueryParam = {
        attributes: ["province", 'progress', 'weight', 'step', 'event', 'taskId', 'parentTaskId',
            'plannedStartTime', 'plannedEndTime', 'actualStartTime', 'actualEndTime', "responsiblePerson", "updatedAt", "index"]
    };
    var problemInfoQueryParams = {
        attributes: ["province", "taskId", "problemDate", "expectedResolutionDate", "describe", "questioner", "responsible", "state", "updatedAt", "proposes", "solution", "progressAndResults"],
        where: {'state': ["open", "padding"]}
    };
    if (hasProvince) {
        taskTimeQueryParam["where"] = {'province': _province};
    }

    models.Task.findAll(taskTimeQueryParam).then(function (result) {
        timeTaskResult = result;
    }).then(function () {
        if (hasProvince) {
            taskInfoQueryParam["where"] = {'province': _province};
        }
        return models.Task.findAll(taskInfoQueryParam);
    }).then(function (result) {
        infoTaskResult = result;
    }).then(function () {
        if (hasProvince) {
            problemInfoQueryParams["where"] = {'province': _province, 'state': ["open", "padding"]};
        }
        return models.Problem.findAll(problemInfoQueryParams)
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
                weight = (1 / weight);
                var progress = taskModel.get("progress") || 0;
                var taskId = taskModel.get("taskId");
                var temp = taskCollection.where({province: province, parentTaskId: taskId});
                var childWeight = getWeight(temp, province, taskModel.get("taskId"));
                if (childWeight === -1) { //无子节点
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
            var state = Problem.state;
            var updatedAt = Problem.updatedAt;
            var sameDay = moment().format("YYYY-MM-DD") === moment(updatedAt).format("YYYY-MM-DD");
            var proposes = Problem.proposes;
            var solution = Problem.solution;
            var progressAndResults = Problem.progressAndResults;

            problemCollection.push({
                province: province,
                taskId: taskId,
                problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : "",
                expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : "",
                describe: describe,
                questioner: questioner,
                state: state,
                responsible: responsible,
                sameDay: sameDay,
                proposes: proposes,
                solution: solution,
                progressAndResults: progressAndResults
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
            var index = Task.index;
            var updatedAt = Task.updatedAt;
            var sameDay = moment().format("YYYY-MM-DD") === moment(updatedAt).format("YYYY-MM-DD");

            taskCollection.push({
                index: index,
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
                event: event,
                updatedAt: updatedAt ? moment(updatedAt).format("YYYY-MM-DD") : "",
                sameDay: sameDay
            });
        });

        var total = 0;
        _.each(provinces, function (cityName, cityCode) {
            if (hasProvince && cityCode !== _province) {
                return;
            }
            var weight = 0;
            var phases = [];
            var tempPhases = taskCollection.where({province: cityCode});
            _.each(tempPhases, function (taskModel) {
                var json = taskModel.toJSON();
                var index = json.index;
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
                var hasWarn = false;
                var warmMessage = "";
                if (json.plannedStartTime && json.progress !== 100) {//如果有计划开始时间并且进度非百分百
                    if ((!json.actualStartTime && moment().isAfter(json.plannedStartTime)) || moment(json.actualStartTime).isAfter(json.plannedStartTime)) {
                        hasWarn = true;
                        warmMessage += "【到期未开始】";
                    }
                }
                if (json.plannedEndTime && json.progress !== 100) {
                    if ((!json.actualEndTime && moment().isAfter(json.plannedEndTime)) || moment(json.actualEndTime).isAfter(json.plannedEndTime)) {
                        hasWarn = true;
                        warmMessage += "【到期未结束】";
                    }
                }

                if (json.progress !== 100 && json.plannedStartTime && json.plannedEndTime && moment().isAfter(json.plannedStartTime)) {
                    var diff = moment(json.plannedEndTime).diff(moment(json.plannedStartTime));
                    var pass = moment().diff(moment(json.plannedStartTime));
                    diff = (diff / (1000 * 60 * 60 * 24));
                    diff = diff.toFixed(0);
                    pass = (pass / (1000 * 60 * 60 * 24));
                    pass = pass.toFixed(0);
                    if (pass > diff) {
                        hasWarn = true;
                        warmMessage += "【延迟风险】【已延期】";
                    } else if ((pass / diff) > (json.progress / 100)) {
                        hasWarn = true;
                        warmMessage += "【延迟风险】";
                    }
                    // console.log("diff====" + diff + "pass=====" + pass);
                }


                if (hasWarn) {
                    json["warn"] = {
                        "detail": [
                            {"message": warmMessage || ""}
                        ]
                    }
                }
                phases[index] = json;
            });

            if (cityCode === "00030016" || cityCode === "00030026" || cityCode === "00030005" || cityCode === "00030004") {
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
                duty: dutyModel[cityCode] || "", //写死的后面改成
                monitor: monitorModel[cityCode] || "", //写死的后面改成
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
    if (!req.session.user) { //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录";
        res.redirect("/login"); //未登录则重定向到 /login 路径
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

        res.send({code: 0, message: '已经完成导入'}); //并不完美
        var workbook = xlsx.parse(filepath);
        models.Task.destroy({'where': {'province': province}}).then(function () {
            // models.Problem.destroy({'where': {'province': province}}).then(function () {
            workbook.forEach(function (sheet, index) {
                var name = sheet.name;
                var rows = sheet.data;

                function handleDate(excelDate) {
                    if (_.isNumber(excelDate)) {
                        return new Date(1900, 0, excelDate - 1);
                    } else {
                        return undefined;
                    }
                }

                if (name.indexOf("04") === 0) {
                    var taskCollection = new TaskCollection();

                    var hasCol2 = false;
                    var preStep = undefined;
                    //计划日报（主计划每日更新）
                    var showIndex = 0;
                    rows.forEach(function (row, index) {
                        if (_.isEmpty(row)) {
                            return;
                        } else {
                            console.log("row:" + row + "|" + index);
                        }
                        if (index === 1) {
                            hasCol2 = (row[2] === undefined);
                        }
                        if (index >= 2) { //从第二行开始
                            if (_.isEmpty(row)) {
                                return;
                            }
                            var taskId = row[0] + ""; //任务编号
                            console.log("taskId:" + taskId);
                            var parentTaskId = undefined;
                            if (!_.isEmpty(taskId)) {
                                var taskIdSplit = taskId.split(".");
                                parentTaskId = _.initial(taskIdSplit).join(".");
                            }
                            var start = 0;
                            var step;
                            if (hasCol2) {
                                start = 1;
                                step = (row[start] || "") + (row[start + 1] || ""); //关键步骤/子步骤
                            } else {
                                step = (row[start + 1] || ""); //关键步骤/子步骤
                            }
                            //绑定
                            step = _string.trim(step);
                            if (_string.isBlank(step)) {
                                step = preStep;
                            }
                            preStep = step;

                            var event = row[start + 2]; //事件
                            var progress = row[start + 3] || 0; //进度
                            // row[start + 4 ]跳过 状态
                            var missionCritical = row[start + 5]; //关键任务
                            // var weight = row[start+6];
                            // var percent = row[start+7];
                            var percent = undefined;
                            var responsiblePerson = row[start + 6]; //负责人
                            var responsiblePersonPro = "";// row[start + 7]; //厂商责任人

                            var timeLimit = row[start + 7]; //工期 通过计算得到

                            var plannedStartTime = handleDate(row[start + 8]);
                            var plannedEndTime = handleDate(row[start + 9]);
                            var actualStartTime = handleDate(row[start + 10]);
                            var actualEndTime = handleDate(row[start + 11]);

                            var deliverable = row[start + 12];
                            var problemDetail = row[start + 13];


                            // var responsiblePersonPro = row[start + 7]; //厂商责任人
                            // var timeLimit = row[start + 8]; //工期 通过计算得到
                            //
                            // var plannedStartTime = handleDate(row[start + 9]);
                            // var plannedEndTime = handleDate(row[start + 10]);
                            // var actualStartTime = handleDate(row[start + 11]);
                            // var actualEndTime = handleDate(row[start + 12]);
                            //
                            // var deliverable = row[start + 13];
                            // var problemDetail = row[start + 14];


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
                            var json = {
                                province: province,
                                taskId: taskId,
                                parentTaskId: parentTaskId,
                                step: step,
                                event: event,
                                progress: progress,
                                missionCritical: missionCritical,
                                percent: percent,
                                // weight: weight,
                                responsiblePerson: responsiblePerson,
                                responsiblePersonPro: responsiblePersonPro,
                                timeLimit: timeLimit,
                                plannedStartTime: plannedStartTime,
                                plannedEndTime: plannedEndTime,
                                actualStartTime: actualStartTime,
                                actualEndTime: actualEndTime,
                                deliverable: deliverable,
                                problemDetail: problemDetail,
                                index: showIndex
                            };
                            taskCollection.push(json);
                            showIndex++;
                        }
                    });
                    taskCollection.each(function (Model, index, list) {
                        var weight = taskCollection.where({parentTaskId: Model.get("parentTaskId")}).length;
                        Model.set({weight: weight});
                        models.Task.create(Model.toJSON())
                    });
                } else if (name.indexOf("05") === 0) {
                    //问题日报（风险问题每日更新）
                    rows.forEach(function (row, index) {
                        if (index >= 3) { //从第三行开始
                            if (_.isEmpty(row)) {
                                return;
                            }
                            var index = row[0]; //序号
                            var groupType = row[1]; //组别(项目管理/需求分析设计/版本开发/数据割接/系统集成/系统测试)
                            var taskId = row[2]; //关联任务编号
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
            // });
        });
    });
});

const findUser = function (name, password, callback) {
    const _callback = _.isFunction(callback) ? callback : _.noop;
    if (_.isEmpty(name) || _.isEmpty(password)) {
        _callback(false, "用户名");
    }
    models.User.findAll({
        attributes: ["name", "password"],
        where: {
            name: name
        }
    }).then(function (users) {
        if (_.isEmpty(users)) {
            _callback(false, "您输入的帐号不存在");
            return;
        }
        var user = users[0];
        var _password = user.password || "123456";
        if (password === _password) {
            _callback(true, "");
        } else {
            _callback(false, "密码错误");
        }
    });

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

// router.get('/initPassword', function (req, res, next) {
//     _.each(users, function (user) {
//         var password = generatePassword(8, false);
//         user["password"] = password;
//         models.User.create(user);
//     })
//
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
                    "taskId",
                    "step",
                    "progress",
                    "responsiblePerson",
                    "plannedStartTime",
                    "plannedEndTime",
                    "actualStartTime",
                    "actualEndTime",
                    "province"
                ],
                where: {
                    province: province
                },
                order: ['index']
            }).then(function (result) {
                result.forEach(function (Task) {
                    var id = Task.id;
                    var taskId = Task.taskId;
                    var level = taskId.split(".").length || 0;
                    var step = space.substr(0, level * 24) + Task.step;
                    var progress = Task.progress;
                    var responsiblePerson = Task.responsiblePerson;
                    var plannedStartTime = Task.plannedStartTime;
                    var plannedEndTime = Task.plannedEndTime;
                    var actualStartTime = Task.actualStartTime;
                    var actualEndTime = Task.actualEndTime;
                    var province = Task.province;

                    var hasWarn = false;
                    var warmMessage = "";
                    // if (plannedStartTime) {
                    //     if (!actualStartTime && !moment().isBefore(plannedStartTime) && progress !== 1) {
                    //         hasWarn = true;
                    //         warmMessage += "【到期未开始】";
                    //     }
                    // }
                    // if (plannedEndTime) {
                    //     if (!actualEndTime && !moment().isBefore(plannedEndTime) && progress !== 1) {
                    //         hasWarn = true;
                    //         warmMessage += "【到期未结束】";
                    //     }
                    // }


                    if (plannedStartTime && progress !== 1) {//如果有计划开始时间并且进度非百分百
                        if ((!actualStartTime && moment().isAfter(plannedStartTime)) || moment(actualStartTime).isAfter(plannedStartTime)) {
                            hasWarn = true;
                            warmMessage += "【到期未开始】";
                        }
                    }
                    if (plannedEndTime && progress !== 1) {
                        if ((!actualEndTime && moment().isAfter(plannedEndTime)) || moment(actualEndTime).isAfter(plannedEndTime)) {
                            hasWarn = true;
                            warmMessage += "【到期未结束】";
                        }
                    }

                    if (progress !== 1 && plannedStartTime && plannedEndTime && moment().isAfter(plannedStartTime)) {
                        var diff = moment(plannedEndTime).diff(moment(plannedStartTime));
                        var pass = moment().diff(moment(plannedStartTime));
                        diff = (diff / (1000 * 60 * 60 * 24));
                        diff = diff.toFixed(0);
                        pass = (pass / (1000 * 60 * 60 * 24));
                        pass = pass.toFixed(0);
                        if (pass > diff) {
                            hasWarn = true;
                            warmMessage += "【延迟风险】";
                        } else if ((pass / diff) > progress) {
                            hasWarn = true;
                            warmMessage += "【延迟风险】";
                        }
                        // console.log("diff====" + diff + "pass=====" + pass);
                    }

                    if (progress >= 100) {
                        hasWarn = false;
                    }

                    var json = {
                        id: id,
                        taskId: taskId,
                        step: step,
                        progress: progress,
                        progressPercent: (progress * 100 + "%"),
                        responsiblePerson: responsiblePerson,
                        // plannedStartTime: plannedStartTime ? moment(plannedStartTime).format("YYYY-MM-DD") : "",
                        // plannedEndTime: plannedEndTime ? moment(plannedEndTime).format("YYYY-MM-DD") : "",
                        // actualStartTime: actualStartTime ? moment(actualStartTime).format("YYYY-MM-DD") : "",
                        // actualEndTime: actualEndTime ? moment(actualEndTime).format("YYYY-MM-DD") : "",
                        province: province,
                        warmMessage: hasWarn ? warmMessage : "",
                        hasWarn: hasWarn
                    };
                    if (plannedStartTime) {
                        json["plannedStartTime"] = moment(plannedStartTime).format("YYYY-MM-DD");
                    }
                    if (plannedEndTime) {
                        json["plannedEndTime"] = moment(plannedEndTime).format("YYYY-MM-DD");
                    }
                    if (actualStartTime) {
                        json["actualStartTime"] = moment(actualStartTime).format("YYYY-MM-DD");
                    }
                    if (actualEndTime) {
                        json["actualEndTime"] = moment(actualEndTime).format("YYYY-MM-DD");
                    }
                    taskCollection.push(json);
                });
                // res.json()
                res.send({
                    code: 0,
                    msg: "",
                    count: taskCollection.length,
                    data: taskCollection.toJSON()
                });
                // next();
            });
        }
    }
});
router.get('/exportProblemAllInOne', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var problemCollection = new ProblemCollection();
        var infoProblemResult;
        models.Problem.findAll({
            attributes: [
                "index",
                "groupType",
                "province",
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
                "proposes",
                "remark",
                "why",
                "belong",
                "belongPerson",
                "user",
                "updatedAt"]
            // order: [
            //     ['expectedResolutionDate', 'DESC']
            // ]
        }).then(function (result) {
            infoProblemResult = result;
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
                var proposes = Problem.proposes;
                var remark = Problem.remark;
                var province = Problem.province;
                var why = Problem.why;
                var belong = Problem.belong;
                var belongPerson = Problem.belongPerson;
                var user = Problem.user;
                var updatedAt = Problem.updatedAt;
                var json = {
                    id: id,
                    province: province,
                    index: index,
                    groupType: groupType,
                    taskId: taskId,
                    // problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : undefined,
                    // expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : undefined,
                    // theLatestSettlementDate: theLatestSettlementDate ? moment(theLatestSettlementDate).format("YYYY-MM-DD") :undefined,
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
                    proposes: proposes,
                    remark: remark,
                    why: why,
                    belong: belong,
                    belongPerson: belongPerson,
                    user: user
                };
                if (problemDate) {
                    json["problemDate"] = moment(problemDate).format("YYYY-MM-DD");
                }
                if (expectedResolutionDate) {
                    json["expectedResolutionDate"] = moment(expectedResolutionDate).format("YYYY-MM-DD");
                }
                if (theLatestSettlementDate) {
                    json["theLatestSettlementDate"] = moment(theLatestSettlementDate).format("YYYY-MM-DD");
                }

                if (updatedAt) {
                    json["updatedAt"] = moment(updatedAt).format("YYYY-MM-DD");
                }
                problemCollection.push(json);
            });
            var proposesEnums = ['分公司问题', '对分公司的要求'];
            var sheets = [];
            var data = [];

            for (var province in exportsProivce) {
                var firstProvince = true;
                var provinceName = exportsProivce[province];
                for (var index in proposesEnums) {
                    var proposesEnum = proposesEnums[index];
                    var monitor = exportsMonitor[province];
                    var tempProblem = problemCollection.where({province: province, proposes: proposesEnum});
                    data.push(index * 1 === 0 ? [
                        "分公司",
                        "问题归属",
                        "问题提出人",
                        "问题/风险/求助描述",
                        "解决方案",
                        "进展及结果",
                        // "产生日期",
                        // "期望解决日期",
                        "状态"
                        // "组别",
                        // "关联任务编号",
                        // "最晚解决日期",
                        // "内部/外部",
                        // "类别",
                        // "优先级",
                        // "处理责任人",
                        // "备注",
                        // "问题提出方",
                        // // "症结原因",
                        // "问题处理人",
                        // "编辑工号"
                    ] : []);
                    _.each(tempProblem, function (Problem) {
                        var json = Problem.toJSON();
                        var info = [];
                        var cell = "";
                        if (firstProvince === true) {
                            cell += provinceName;
                            cell += "\r\n";
                            cell += monitor;
                            firstProvince = false;
                        }
                        info.push(cell);
                        info.push(json["proposes"] || undefined);
                        info.push(json["questioner"] || undefined);
                        info.push(json["describe"] || undefined);
                        info.push(json["solution"] || undefined);
                        info.push(json["progressAndResults"] || undefined);
                        // info.push(json["problemDate"] || undefined);
                        // info.push(json["expectedResolutionDate"] || undefined);
                        info.push(json["state"] || undefined);
                        // info.push(json["groupType"] || undefined);
                        // info.push(json["taskId"] || undefined);
                        // info.push(json["theLatestSettlementDate"] || undefined);
                        // info.push(json["innerOuter"] || undefined);
                        // info.push(json["subjectType"] || undefined);
                        // info.push(json["priority"] || undefined);
                        // info.push(json["responsible"] || undefined);
                        // info.push(json["remark"] || undefined);
                        // // info.push(json["why"] || undefined);
                        // info.push(json["belong"] || undefined);
                        // info.push(json["belongPerson"] || undefined);
                        // info.push(json["user"] || undefined);
                        data.push(info);
                    });
                }


                // res.send('export successfully!');
            }
            sheets.push({
                name: "各省份问题",
                data: data
            });
            var buffer = xlsx.build(sheets); // Returns a buffer
            res.attachment("问题导出列表汇总.xlsx");
            res.set("Content-Type", "application/vnd.openxmlformats");
            res.end(buffer, "binary");

        });
    }
});

router.get('/exportProblem', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var problemCollection = new ProblemCollection();
        var infoProblemResult;
        models.Problem.findAll({
            attributes: [
                "index",
                "groupType",
                "province",
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
                "proposes",
                "remark",
                "why",
                "belong",
                "belongPerson",
                "user",
                "updatedAt"]
            // order: [
            //     ['expectedResolutionDate', 'DESC']
            // ]
        }).then(function (result) {
            infoProblemResult = result;
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
                var proposes = Problem.proposes;
                var remark = Problem.remark;
                var province = Problem.province;

                var why = Problem.why;
                var belong = Problem.belong;
                var belongPerson = Problem.belongPerson;
                var user = Problem.user;
                var updatedAt = Problem.updatedAt;


                var json = {
                    id: id,
                    province: province,
                    index: index,
                    groupType: groupType,
                    taskId: taskId,
                    // problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : undefined,
                    // expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : undefined,
                    // theLatestSettlementDate: theLatestSettlementDate ? moment(theLatestSettlementDate).format("YYYY-MM-DD") :undefined,
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
                    proposes: proposes,
                    remark: remark,
                    why: why,
                    belong: belong,
                    belongPerson: belongPerson,
                    user: user
                };
                if (problemDate) {
                    json["problemDate"] = moment(problemDate).format("YYYY-MM-DD");
                }
                if (expectedResolutionDate) {
                    json["expectedResolutionDate"] = moment(expectedResolutionDate).format("YYYY-MM-DD");
                }
                if (theLatestSettlementDate) {
                    json["theLatestSettlementDate"] = moment(theLatestSettlementDate).format("YYYY-MM-DD");
                }

                if (updatedAt) {
                    json["updatedAt"] = moment(updatedAt).format("YYYY-MM-DD");
                }

                problemCollection.push(json);

            });
            var sheets = [[]];
            var allExcel = {"name": "汇总"};
            var allSheetData = [];
            for (var province in provinceInfos) {
                var provinceName = provinceInfos[province];
                var tempProblem = problemCollection.where({province: province});
                var data = [
                    [
                        "问题提出人",
                        "问题/风险/求助描述",
                        "产生日期",
                        "期望解决日期",
                        "状态",
                        "组别",
                        "关联任务编号",
                        "最晚解决日期",
                        "内部/外部",
                        "类别",
                        "优先级",
                        "解决方案",
                        "进展及结果",
                        "处理责任人",
                        "备注",
                        "问题提出方",
                        // "症结原因",
                        "问题归属",
                        "问题处理人",
                        "编辑工号"
                    ]
                ];

                _.each(tempProblem, function (Problem) {
                    var json = Problem.toJSON();
                    var info = [];
                    info.push(json["questioner"] || undefined);
                    info.push(json["describe"] || undefined);
                    info.push(json["problemDate"] || undefined);
                    info.push(json["expectedResolutionDate"] || undefined);
                    info.push(json["state"] || undefined);
                    info.push(json["groupType"] || undefined);
                    info.push(json["taskId"] || undefined);
                    info.push(json["theLatestSettlementDate"] || undefined);
                    info.push(json["innerOuter"] || undefined);
                    info.push(json["subjectType"] || undefined);
                    info.push(json["priority"] || undefined);
                    info.push(json["solution"] || undefined);
                    info.push(json["progressAndResults"] || undefined);
                    info.push(json["responsible"] || undefined);
                    info.push(json["remark"] || undefined);

                    info.push(json["proposes"] || undefined);
                    // info.push(json["why"] || undefined);
                    info.push(json["belong"] || undefined);
                    info.push(json["belongPerson"] || undefined);
                    info.push(json["user"] || undefined);

                    // questioner  问题提出人
                    // describe  问题/风险/求助描述
                    // problemDate 产生日期
                    // expectedResolutionDate 期望解决日期
                    // state  状态
                    // groupType  组别
                    // taskId   关联任务编号
                    // theLatestSettlementDate  最晚解决日期
                    // innerOuter 内部/外部
                    // subjectType 类别
                    // priority 优先级
                    // solution 解决方案
                    // progressAndResults 进展及结果
                    // responsible 处理责任人
                    // remark 备注


                    data.push(info);
                });
                sheets.push({
                    name: provinceName,
                    data: data
                });

                allSheetData.push({});
                // res.send('export successfully!');
            }
            var buffer = xlsx.build(sheets); // Returns a buffer
            // fs.writeFileSync('问题导出列表.xlsx', buffer, 'binary');
            res.attachment("问题导出列表.xlsx");
            res.set("Content-Type", "application/vnd.openxmlformats");
            res.end(buffer, "binary");

        });


    }
});

router.post('/submitTaskCell', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var id = req.body.id;
            // var progress = req.body.progress;
            var field = req.body.field;
            var value = req.body.value;

            if ("actualStartTime" === field) {
                value = value ? moment(value).format("YYYY-MM-DD") : undefined;
            }

            if ("actualEndTime" === field) {
                value = value ? (moment(value).format("YYYY-MM-DD") + " 15:59:59") : undefined;
            }
            var param = {};
            param[field] = value;

            models.Task.update(
                param, {
                    'where': {'id': id}
                }
            ).then(function () {
                res.send({
                    code: 0, message: ""
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
            var progress = req.body.progress;
            // var field = req.body.field;
            // var plannedStartTime = req.body.plannedStartTime;
            // var plannedEndTime = req.body.plannedEndTime;
            var actualStartTime = req.body.actualStartTime;
            var actualEndTime = req.body.actualEndTime;

            // plannedStartTime = plannedStartTime ? moment(plannedStartTime).format("YYYY-MM-DD") : undefined;
            // plannedEndTime = plannedEndTime ? moment(plannedEndTime).format("YYYY-MM-DD") : undefined;
            actualStartTime = actualStartTime ? new Date(moment(actualStartTime).format("YYYY-MM-DD")) : undefined;
            actualEndTime = actualEndTime ? new Date((moment(actualEndTime).format("YYYY-MM-DD") + " 15:59:59")) : undefined;

            //
            // plannedStartTime: DataTypes.DATE,
            //     plannedEndTime: DataTypes.DATE,
            //     actualStartTime: DataTypes.DATE,
            //     actualEndTime: DataTypes.DATE,
            //

            var param = {
                progress: progress,
                // plannedStartTime: plannedStartTime,
                // plannedEndTime: plannedEndTime,
                actualStartTime: actualStartTime,
                actualEndTime: actualEndTime
            };
            // param[field] = value;
            models.Task.update(
                param, {
                    'where': {'id': id}
                }
            ).then(function () {
                res.send({
                    code: 0, message: ""
                });
            });
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
                    "proposes",
                    "monitor",
                    "remark",
                    "why",
                    "belong",
                    "belongPerson"],
                where: {
                    province: province
                },
                order: [
                    ['expectedResolutionDate', 'DESC']
                ]
            }).then(function (result) {
                infoProblemResult = result;
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
                    var proposes = Problem.proposes;
                    var why = Problem.why;
                    var belong = Problem.belong;
                    var belongPerson = Problem.belongPerson;

                    var json = {
                        id: id,
                        province: province,
                        index: index,
                        groupType: groupType,
                        taskId: taskId,
                        // problemDate: problemDate ? moment(problemDate).format("YYYY-MM-DD") : undefined,
                        // expectedResolutionDate: expectedResolutionDate ? moment(expectedResolutionDate).format("YYYY-MM-DD") : undefined,
                        // theLatestSettlementDate: theLatestSettlementDate ? moment(theLatestSettlementDate).format("YYYY-MM-DD") :undefined,
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
                        remark: remark,
                        proposes: proposes,
                        why: why,
                        belong: belong,
                        belongPerson: belongPerson
                    };
                    if (problemDate) {
                        json["problemDate"] = moment(problemDate).format("YYYY-MM-DD");
                    }
                    if (expectedResolutionDate) {
                        json["expectedResolutionDate"] = moment(expectedResolutionDate).format("YYYY-MM-DD");
                    }
                    if (theLatestSettlementDate) {
                        json["theLatestSettlementDate"] = moment(theLatestSettlementDate).format("YYYY-MM-DD");
                    }
                    problemCollection.push(json);
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
router.post('/updateProblemCell', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var id = req.body.id;
            var field = req.body.field;
            var value = req.body.value;
            var param = {};
            param[field] = value;
            models.Problem.update(
                param, {
                    'where': {'id': id}
                }
            ).then(function () {
                res.send({code: 0, message: ''});
            });
        }
    }
});

router.post('/updateProblem', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var province = user.province;
            var id = req.body.id;
            var state = req.body.state;
            var param = {
                "state": state
            };
            models.Problem.update(
                param, {
                    'where': {'id': id}
                }
            ).then(function () {
                res.send({code: 0, message: ''});
            });
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
            var proposes = req.body.proposes;
            var why = req.body.why;
            var belong = req.body.belong;
            var belongPerson = req.body.belongPerson;

            var json = {
                province: province,
                index: index,
                groupType: groupType,
                taskId: taskId,
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
                remark: remark,
                proposes: proposes,
                user: session.user,
                why: why,
                belong: belong,
                belongPerson: belongPerson
            };

            if (problemDate) {
                json["problemDate"] = moment(problemDate).format("YYYY-MM-DD");
            }
            if (expectedResolutionDate) {
                json["expectedResolutionDate"] = moment(expectedResolutionDate).format("YYYY-MM-DD");
            }
            if (theLatestSettlementDate) {
                json["theLatestSettlementDate"] = moment(theLatestSettlementDate).format("YYYY-MM-DD");
            }

            models.Problem.create(json).then(function () {
                res.send({code: 0, message: ''});
            });
        }
    }

});
router.get('/problemAutocomplete', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var user = findUserProvince(session.user);
        if (user) {
            var queryStr = req.query.query;
            var province = user.province;
            models.Task.findAll({
                attributes: ["taskId", "step"],
                where: {
                    province: province,
                    $or: [
                        {
                            taskId: {
                                $like: ('%' + queryStr + '%')
                            }
                        },
                        {
                            step: {
                                $like: ('%' + queryStr + '%')
                            }
                        }
                    ]

                },
                limit: 5,
                offset: 0
            }).then(function (result) {
                var DataInfo = [];
                result.forEach(function (Task) {
                    var taskId = Task.taskId;
                    var step = Task.taskId + "  " + Task.step;
                    DataInfo.push({
                        value: step,
                        data: taskId
                    })
                });
                res.send({
                    suggestions: DataInfo
                });
                // console.log(result);
            });
        }
    }
});

router.get('/whoAmI', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        res.send({code: 0, message: session.user});
        // res.redirect("/ngwf/login.html"); //未登录则重定向到 /login 路径
    } else {
        res.send({code: 1, message: '尚未登录'});
    }
});

router.post('/password', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        var password = req.body._password;
        var param = {
            password: password
        };
        models.User.update(
            param, {
                'where': {name: session.user}
            }
        ).then(function () {
            res.send({code: 0, message: ''});
        })
        // session.user = undefined;
        // res.send({code: 0, message: ''});
        // res.redirect("/ngwf/login.html"); //未登录则重定向到 /login 路径
    } else {
        res.send({code: 1, message: '尚未登录无法修改密码'});
    }
});

router.get('/logoff', function (req, res, next) {
    var session = req.session;
    if (_.isString(session.user)) {
        session.user = undefined;
        res.send({code: 0, message: ''});
        // res.redirect("/ngwf/login.html"); //未登录则重定向到 /login 路径
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
    var _userName = req.body.username;
    findUser(_userName, req.body.password, function (success, message) {
        if (success) {
            session.regenerate(function (err) {
                if (err) {
                    return res.json({code: 2, message: '登录失败'});
                }
                req.session.user = _userName;
                res.json({code: 0, message: '登录成功'});
            });
        } else {
            res.json({code: 1, message: message});
        }

    });
});

module.exports = router;
