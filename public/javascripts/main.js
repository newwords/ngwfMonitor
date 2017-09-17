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
        Handlebars.registerHelper('problemSum', function (val) {
            var sum = 0;
            for (var key in val) {
                sum += val[key].problem.detail.length;
            }
            return sum
        });
        Handlebars.registerHelper('warnSum', function (val) {
            var sum = 0;
            for (var key in val) {
                sum += val[key].warn.detail.length;
            }
            return sum
        });
        Handlebars.registerHelper('overviewWarnSum', function (val) {
            return val.warn.detail.length
        });
        Handlebars.registerHelper('overviewProblemSum', function (val) {
            return val.problem.detail.length;
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
                "click .control span": "control"
            },
            control: function (e) {
                var _this = this;
                var $el = $(e.currentTarget);
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
                                return "项目进度: <br/>" + val.data.name + ": " + val.data.value + "%"
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
