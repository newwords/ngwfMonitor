define(["jquery"], function ($) {

    var data = {
        "total": "25",
        "citys": [
            {
                "name": "山西",
                "rate": "0",
                "state": "未开始",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "辽宁",
                "rate": "0",
                "state": "已延迟",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "吉林",
                "rate": "100",
                "state": "已完成",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "黑龙江",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "江苏",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "浙江",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "安徽",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "福建",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "江西",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "山东",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "河南",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "湖北",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "湖南",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "广东",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "海南",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "四川",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "贵州",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "云南",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "陕西",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "甘肃",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "青海",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "台湾",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "北京",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "天津",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "上海",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "重庆",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "广西",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "新疆",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "西藏",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "宁夏",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "内蒙古",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "香港",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }, {
                "name": "澳门",
                "rate": "20",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "name": "河北",
                "rate": "20",
                "state": "进行中",
                "bgnTime": "2017/08/01",
                "endTime": "2017-09-31",
                "duty": "左宗棠",
                "phases": [
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟配合改造工作延迟"
                                }
                            ]
                        }
                    },
                    {
                        "name": "准备阶段",
                        "process": "30",
                        "duty": "段誉",
                        "bgnTime": "2017-08-01",
                        "endTime": "2017-08-20",
                        "warn": {
                            "detail": [{"message": "配合改造工作延迟"}]
                        },
                        "problem": {
                            "detail": [
                                {
                                    "person": "赵四",
                                    "madeTime": "2017-09-01",
                                    "expectTime": "2017-09-10",
                                    "solver": "刘能",
                                    "describe": "缺少接口梳理人员"
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };
    var mapData = [];
    for (var key in data.citys) {
        mapData[key] = {};
        mapData[key].name = data.citys[key].name;
        mapData[key].value = +data.citys[key].rate;
    }
    return {
        getMapData: function (callback) {
            $.ajax({
                timeout:600000,
                type: "POST",
                dataType: 'json',
                url: "/ajax",
                success: function (result) {
                    if (_.isFunction(callback)) {
                        callback(result);
                    }

                },
                error: function (error) {
                    if (_.isFunction(callback)) {
                        callback([]);
                    }
                }
            });

        }, getProblemData: function (province, callback) {

        }
    }
});
