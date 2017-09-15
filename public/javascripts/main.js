require(['backbone', 'data', 'echarts', 'china'], function (Backbone, mapData, echarts) {
    var _content = this;
    var mapView = Backbone.View.extend({
        initialize: function () {
            var _this = this;
            _this.chart = echarts.init(_this.el);
            _this.chart.setOption({

                tooltip: {
                    trigger: 'item',
                    formatter: function (val) {
                        return val.data.name && '项目进度: <br/>' + val.data.name + ": " + val.data.value + "%"
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
                        },
                        data: mapData
                    }
                ]
            });

        }
    });

    $('#map').css({
        'width': window.innerWidth,
        'height': window.innerHeight
    });

    _content.mapView = new mapView({
        el: "#map"
    });

    // width: window.innerWidth,
    //     height: window.innerHeight

    // $("body").append(_content.mapView.render().$el);
});
