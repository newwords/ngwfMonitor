require(['backbone', 'handlebars', 'text!tpl/didi.hbs', 'dateformat'], function (Backbone, Handlebars, tpl, dateFormat) {
    var _content = this;

    var pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
            val = '0' + val;
        }
        return val;
    };

    var fix00 = function (val) {// 修正双位时间
        return pad(val);
    };

    Handlebars.registerHelper("addOne", function (index) {
        return index + 1;
    });

    Handlebars.registerHelper("randTime", function (dateTime) {
        var hh = Math.round(8 + Math.random() * (23 - 8));
        var mm = Math.round(Math.random() * 59);
        return fix00(hh) + ":" + fix00(mm);
    });

    Handlebars.registerHelper("dateFormat", function (dateTime) {
        // var days = ["日", "一", "二", "三", "四", "五", "六"];
        var tempDate = new Date(dateTime);
        return dateFormat(tempDate.getTime(), "mm-dd");

    });

    Handlebars.registerHelper("dayWeek", function (dateTime) {
        var days = ["日", "一", "二", "三", "四", "五", "六"];
        var tempDate = new Date(dateTime);
        return "周" + days[tempDate.getDay()];

    });


    Handlebars.registerHelper("getLeftGl", function (gl) {
        var GL = ["", "", "", "37.5425", "37.7133"];
        var tempGl = (gl * 1).toFixed(1);
        if (_.isString(tempGl)) {
            return GL[tempGl.length];
        }
        return "";
    });

    Handlebars.registerHelper("getMoney", function (money) {
        return (money * 1).toFixed(2);
    });


    Handlebars.registerHelper("getTop", function (index) {
        // var tops = [
        //     "27.0529",
        //     "29.6362",
        //     "32.2196",
        //     "34.8029",
        //     "37.3862",
        //     "39.9696",
        //     "42.5529",
        //     "45.1362",
        //     "47.7196",
        //     "50.3029",
        //     "52.8862",
        //     "55.4696"
        // ];
        var tops =[
            "15.7196",
            "18.3029",
            "20.8862",
            "23.4696",
            "26.0529",
            "28.6362",
            "31.2196",
            "33.8029",
            "36.3862",
            "38.9696"
        ];
        return tops[index];
    });
    var DiDiView = Backbone.View.extend({

        template: Handlebars.compile(tpl),
        initialize: function () {
            var _this = this;
            var json = {
                dateOfApplication: dateFormat(new Date().getTime(), "yyyy-mm-dd"),
                phoneNumber: "18252795895",
                tripBeginTime: "2017-09-02",
                tripEndTime: "2017-09-29",
                count: 17,
                money: "212.70",
                rows: [
                    {
                        time: "2017-09-02",
                        type: "快车",
                        city: "郑州",
                        from: "中移在线服务有限公司",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.1",
                        money: "8"
                    },
                    {
                        time: "2017-09-03",
                        type: "快车",
                        city: "郑州",
                        from: "中移在线服务有限公司",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.0",
                        money: "8"
                    },
                    {
                        time: "2017-09-11",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.2",
                        money: "8"
                    },
                    {
                        time: "2017-09-12",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.1",
                        money: "8"
                    },
                    {
                        time: "2017-09-13",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.2",
                        money: "8"
                    },
                    {
                        time: "2017-09-15",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.0",
                        money: "8"
                    },
                    {
                        time: "2017-09-17",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.1",
                        money: "8.0"
                    },
                    {
                        time: "2017-09-19",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.3",
                        money: "8.0"
                    },
                    {
                        time: "2017-09-21",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.1",
                        money: "8.0"
                    },
                    {
                        time: "2017-09-22",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.6",
                        money: "8.3"
                    },
                    {
                        time: "2017-09-23",
                        type: "快车",
                        city: "郑州",
                        from: "河南省电子商务产业园",
                        to: "汉庭酒店(郑州冬青街店)",
                        gl: "2.1",
                        money: "8"
                    },
                    {
                        time: "2017-09-24",
                        type: "快车",
                        city: "郑州",
                        from: "汉庭酒店(郑州冬青街店)",
                        to: "郑州大学第一附属医院",
                        gl: "22.70",
                        money: "46.8"
                    }
                ]
            };
            _this.$el.html(this.template(json));

        }
    });

    _content.didiView = new DiDiView({
        el: "#root"
    });
});
