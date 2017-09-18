require(['backbone', 'handlebars', 'data', 'echarts', 'text!tpl/main.hbs', 'text!tpl/list.hbs', 'china'],
    function (Backbone, Handlebars, mapData, echarts, mainTpl, listTpl) {
        /**
         * 文字截断
         */
        Handlebars.registerHelper('mapText', function (val) {
            return val.length > 11 ? val.slice(0, 11) + '..' : val
        });
        Handlebars.registerHelper('warnText', function (val) {
            return val.length > 42 ? val.slice(0, 42) + '..' : val
        });
        Handlebars.registerHelper('problemText', function (val) {
            return val.length > 20 ? val.slice(0, 20) + '..' : val
        });

        /**
         * 告警和错误的数量
         */
        Handlebars.registerHelper('problemSum', function (items) {
            var sum = 0;
            for (var key in items) {
                var item = items[key]
                if (_.has(item, 'problem')) {
                    sum += item.problem.detail.length;
                }
            }
            return sum
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
        Handlebars.registerHelper('overviewWarnSum', function (val) {
            if (_.has(val, "warn")) {
                return '<span class="warn-a"><a>' + val.warn.detail.length + '</a></span>';
            }
            return "";
        });
        Handlebars.registerHelper('overviewProblemSum', function (val) {
            if (_.has(val, "problem")) {
                return '<span class="problem-a"><a>' + val.problem.detail.length + '</a></span>';
            }
            return "";
        });

        Handlebars.registerHelper('stateIcon', function (val, option) {
            if (val > 0) {
                return option.fn(this)
            } else {
                return option.inverse(this)
            }
        });

        var _content = this;
        var listTemplate = Handlebars.compile(listTpl);
        var MapView = Backbone.View.extend({
            template: Handlebars.compile(mainTpl),
            events: {
                "click .control span": "control",
                "click span.span_control": "spanControl"
            },
            spanControl: function (e) {
                debugger;
                var _this = this;
                var target = e.target || e.currentTarget;
                var $el = $(target).closest('.span_control');
                var city = $el.closest(".city");
                if ($el.hasClass("span_detail")) {
                    city.find(".detail").toggle();
                    city.find(".warn").hide();
                    city.find(".problem").hide();
                } else if ($el.hasClass("span_warn")) {
                    city.find(".warn").toggle();
                    city.find(".detail").hide();
                    city.find(".problem").hide();
                } else if ($el.hasClass("span_problem")) {
                    city.find(".problem").toggle();
                    city.find(".warn").hide();
                    city.find(".detail").hide();
                }
                // var $el = $el.closest('span.span_control');
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

                    // controlHide();
                    // rightEvent()

                } else {
                    _this.$map.show();
                    _this.$list.hide();
                    // $(".map-warn").show()
                    // $(".map-problem").show();
                }

            },
            initialize: function () {
                var _this = this;
                _this.$el.html(this.template());
                _this.$map = _this.$el.find("#map");
                _this.$list = _this.$el.find("#list");
                _this.$map.css({
                    'width': window.innerWidth,
                    'height': window.innerHeight
                });
                _this.chart = echarts.init(_this.$map[0]);
                _this.chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (val) {
                            if (_.has(val.data, "value")) {
                                var detailInfo = "";
                                if (_.has(val.data, "phases")) {
                                    var problemSum = 0;
                                    var warnSum = 0;
                                    _.each(val.data.phases, function (phase) {
                                        if (_.has(phase, "problem")) {
                                            problemSum += phase.problem.detail.length;
                                        }
                                        if (_.has(phase, "warn")) {
                                            warnSum += phase.warn.detail.length;
                                        }
                                    });
                                    // for (var key in val.data.phases) {
                                    //     debugger;
                                    //     problemSum += val.data.phases[key].problem.detail.length;
                                    //     warnSum += val.data.phases[key].warn.detail.length;
                                    // }
                                    detailInfo = "<br/>告警:" + warnSum + "<br/>问题:" + problemSum;
                                }
                                return "项目进度: <br/>" + val.data.name + ": " + val.data.value + "%" + detailInfo;
                            }
                            return "";
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: []
                    },
                    visualMap: {
                        min: 0,
                        max: 100,
                        left: '12%',
                        top: 'bottom',
                        text: ['高', '低'],
                        calculable: true,
                        inRange: {
                            color: ['#e0ffff', '#006edd']
                        }
                    },
                    series: [
                        {
                            name: '统计数据',
                            type: 'map',
                            mapType: 'china',
                            showLegendSymbol: false,
                            label: {
                                normal: {
                                    show: true,
                                    position: ['50', '50'],
                                    formatter: '{b}'
                                },
                                emphasis: {
                                    show: true,
                                    position: ['50', '50'],
                                    formatter: '{b}'
                                }
                            }
                            // },
                            // data: mapData
                        }
                    ]
                });

            }
        });


        _content.mapView = new MapView({
            el: "#root"
        });

        mapData.getMapData(function (data) {
            _content.mapView.chart.setOption({
                series: [{
                    data: data["citys"]
                }]
            });

            _content.mapView.$list.html(listTemplate(data))
        });


        // width: window.innerWidth,
        //     height: window.innerHeight

        // $("body").append(_content.mapView.render().$el);
    });
