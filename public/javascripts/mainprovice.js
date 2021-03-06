require(['backbone', 'handlebars', 'data', 'echarts', 'text!tpl/mainprovice.hbs', 'text!tpl/listprovice.hbs', 'text!tpl/mapdata.hbs', 'china', 'layui'],
    function (Backbone, Handlebars, mapData, echarts, mainTpl, listTpl, mapInfo) {

        /**
         * 告警和错误的数量
         */
        Handlebars.registerHelper('problemSum', function (items) {
            return items.length || 0;
        });
        Handlebars.registerHelper('warnSum', function (items) {
            var sum = 0;
            for (var key in items) {
                var item = items[key];
                if (_.has(item, "warn")) {
                    sum += item.warn.detail.length;
                }
            }
            return sum
        });

        Handlebars.registerHelper('ident', function (val) {
            if (!val) {
                return "";
            }
            var len = val.taskId.split('.').length - 1;
            var warn, problem;
            warn = `<span class="warn-a-none"><a></a></span>`;
            problem = `<span class="problem-a-none"><a></a></span>`;
            if (_.has(val, "warn")) {
                if (_.has(val.warn, "detail") && _.isArray(val.warn.detail) && val.warn.detail.length > 0) {
                    warn = `<span class="warn-a"><a>${val.warn.detail.length}</a></span>`;
                }
            }
            if (_.has(val, "problem")) {
                if (_.has(val.problem, "detail") && _.isArray(val.problem.detail) && val.problem.detail.length > 0) {
                    problem = `<span class="problem-a"><a>${val.problem.detail.length}</a></span>`;
                }
            }
            if (!len) {
                return `<li class="phase" title="${this.step}">
          ${this.step}
        </li>`
            }
            return `<li class="phase" title="${this.step}">
          ${warn}${problem}<span style="text-indent: ${len}rem">${this.step}</span>
        </li>`
        });

        Handlebars.registerHelper('actualStartTime', function (val) {
            if (!val) {
                return;
            }
            if (val.actualStartTime && val.plannedStartTime && (val.actualStartTime !== val.plannedStartTime)) {
                return `<span class="mark-time start-time" title="${val.actualStartTime}">!</span>`
            }
        });
        Handlebars.registerHelper('actualEndTime', function (val) {
            if (!val) {
                return;
            }
            if (val.actualEndTime && val.plannedEndTime && (val.actualEndTime !== val.plannedEndTime)) {
                return `<span class="mark-time end-time" title="${val.actualEndTime}">!</span>`
            }
        });

        Handlebars.registerHelper('provinceTo', function (val) {
            var provinceList = {
                '00030001': '北京',
                '00030002': '天津',
                '00030003': '内蒙古',
                '00030004': '河北',
                '00030005': '黑龙江',
                '00030006': '辽宁',
                '00030007': '吉林',
                '00030008': '山东',
                '00030009': '河南',
                '00030010': '山西',
                '00030011': '陕西',
                '00030012': '甘肃',
                '00030013': '宁夏',
                '00030014': '新疆',
                '00030015': '西藏',
                '00030016': '云南',
                '00030017': '四川',
                '00030018': '重庆',
                '00030019': '湖北',
                '00030020': '湖南',
                '00030021': '江苏',
                '00030022': '江西',
                '00030023': '浙江',
                '00030024': '福建',
                '00030025': '广东',
                '00030026': '广西',
                '00030027': '贵州',
                '00030028': '上海',
                '00030029': '海南',
                '00030030': '安徽',
                '00030031': '青海'
            };
            return provinceList[val]
        });

        Handlebars.registerHelper('stateIcon', function (val, option) {
            if (val > 0) {
                return option.fn(this)
            } else {
                return option.inverse(this)
            }
        });

        Handlebars.registerHelper('update', function (val, option) {
            if (val && val.sameDay === true) {
                return option.fn(this)
            } else {
                return option.inverse(this)
            }
        });

        var _content = this;
        var listTemplate = Handlebars.compile(listTpl);
        var mapInfoTemplate = Handlebars.compile(mapInfo)
        var MapView = Backbone.View.extend({
            template: Handlebars.compile(mainTpl),
            events: {
                "click .control span": "control",
                "click span.span_control": "spanControl",
                "click #exportProblem": "exportProblem",
                "click #exportProblemAll": "exportProblemAll",
                "mouseover span.mark-time": "showTime"
            },
            exportProblemAll: function () {
                window.frames['downloadFrame'].location = "/exportProblemAllInOne";
            },
            exportProblem: function (e) {
                window.frames['downloadFrame'].location = "/exportProblem";
            },
            spanControl: function (e) {
                var _this = this;
                var target = e.target || e.currentTarget;
                var $el = $(target).closest('.span_control');
                var city = $el.closest(".city");
                if ($el.hasClass("span_detail")) {
                    city.find(".detail").toggle();
                    switchIcon($el);
                    city.find(".warn").hide();
                    city.find(".problem").hide();
                } else if ($el.hasClass("span_warn")) {
                    city.find(".warn").toggle();
                    switchIcon($el);
                    city.find(".detail").hide();
                    city.find(".problem").hide();
                } else if ($el.hasClass("span_problem")) {
                    city.find(".problem").toggle();
                    switchIcon($el);
                    city.find(".warn").hide();
                    city.find(".detail").hide();
                }

                // var $el = $el.closest('span.span_control');

                function switchIcon(ele) {
                    if (ele.siblings().find('i').hasClass('icon-up_arrow')) {
                        ele.siblings().find('i').removeClass('icon-up_arrow').addClass('icon-down_arrow')
                    }
                    if (ele.find('i').hasClass('icon-down_arrow')) {
                        ele.find('i').removeClass('icon-down_arrow').addClass('icon-up_arrow')
                    } else {
                        ele.find('i').removeClass('icon-up_arrow').addClass('icon-down_arrow')
                    }
                }
            },
            control: function (e) {
                var _this = this;
                var target = e.target || e.currentTarget;
                var $el = $(target);
                $el.siblings().removeClass('active');
                $el.addClass('active');
                if ($el.attr('class') !== 'map active') {
                    _this.$map.hide();
                    _this.$list.show();
                    _this.$mapInfo.hide();
                    // controlHide();
                    // rightEvent()

                } else {
                    _this.$map.show();
                    _this.$list.hide();
                    _this.$mapInfo.show();
                    // $(".map-warn").show()
                    // $(".map-problem").show();
                }

            },
            showTime: function (e) {
                var target = e.target;
                var title = e.target.title;
                if ($(target).hasClass('start-time')) {
                    layui.layer.tips(`实际开始时间: ${title}`, target, {
                        tips: 3,
                        time: 3000
                    })
                } else {
                    layui.layer.tips(`实际结束时间: ${title}`, target, {
                        tips: 3,
                        time: 3000
                    })
                }
            },
            initialize: function () {
                var _this = this;
                _this.$el.html(this.template());
                _this.$map = _this.$el.find("#map");
                _this.$list = _this.$el.find("#list");
                _this.$mapInfo = _this.$el.find('#info')
                // _this.$map.css({
                //     'width': (window.innerWidth - 100),
                //     'height': (window.innerHeight - 100)
                // });
                // = echarts.init(_this.$map[0]);
                // .setOption({
                //     tooltip: {
                //         trigger: 'item',
                //         formatter: function (val) {
                //             if (_.has(val.data, "value")) {
                //                 var detailInfo = "";
                //                 if (_.has(val.data, "phases")) {
                //                     var problemSum = 0;
                //                     var warnSum = 0;
                //                     _.each(val.data.phases, function (phase) {
                //                         // if (_.has(phase, "problem")) {
                //                         //   problemSum += phase.problem.detail.length;
                //                         // }
                //                         if (_.has(phase, "warn")) {
                //                             warnSum += phase.warn.detail.length;
                //                         }
                //                     });
                //                     problemSum = val.data.problems.length;
                //                     // for (var key in val.data.phases) {
                //                     //     debugger;
                //                     //     problemSum += val.data.phases[key].problem.detail.length;
                //                     //     warnSum += val.data.phases[key].warn.detail.length;
                //                     // }
                //                     detailInfo = "<br/>告警:" + warnSum + "<br/>问题:" + problemSum;
                //                 }
                //                 return "项目进度: <br/>" + val.data.name + ": " + val.data.value + "%" + detailInfo;
                //             }
                //             return "";
                //         }
                //     },
                //     legend: {
                //         orient: 'vertical',
                //         left: 'left',
                //         data: []
                //     },
                //     visualMap: {
                //         min: 0,
                //         max: 100,
                //         left: '12%',
                //         top: 'bottom',
                //         text: ['高', '低'],
                //         calculable: true,
                //         inRange: {
                //             color: ['#feffc7', '#02cb00']
                //         }
                //     },
                //     series: [
                //         {
                //             name: '统计数据',
                //             type: 'map',
                //             mapType: 'china',
                //             showLegendSymbol: false,
                //             label: {
                //                 normal: {
                //                     show: true,
                //                     position: ['50', '50'],
                //                     formatter: '{b}'
                //                 },
                //                 emphasis: {
                //                     show: true,
                //                     position: ['50', '50'],
                //                     formatter: '{b}'
                //                 }
                //             }
                //             // },
                //             // data: mapData
                //         }
                //     ]
                // });
                // .on('click', function (para) {
                //     if (_content.data && _content.data['citys']) {
                //         var data = _content.data["citys"];
                //         var province = para.data.province;
                //         for (var key in data) {
                //             if (data[key]['province'] === province) {
                //                 _this.$mapInfo.html(mapInfoTemplate(data[key]))
                //             }
                //         }
                //     }
                // })
            }
        });

        _content.mapView = new MapView({
            el: "#root"
        });
        _content.data = undefined;
        mapData.getMapData(function (data) {
            _content.data = data;
            if (_content.data && _content.data['citys']) {
                // _content.mapView.chart.setOption({
                //     series: [{
                //         data: data["citys"]
                //     }]
                // });
            }
            // data.citys.sort(function (a, b) {
            //     return a.rate - b.rate
            // });
            _content.mapView.$list.html(listTemplate(data))
        });


        // width: window.innerWidth,
        //     height: window.innerHeight

        // $("body").append(_content.mapView.render().$el);
    });
