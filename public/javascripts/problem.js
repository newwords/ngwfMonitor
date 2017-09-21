require(['backbone', 'handlebars', 'text!tpl/problem.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var ProblemListView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        el: "#root",
        events: {
            "click #add": "add",
            "click #delete": "delete",
            "click #edit": "edit"
        },
        add: function () {
            layui.layer.open({
                type: 2,
                title: '',
                area: ['720px', '890px'],
                content: "/ngwf/editProblem.html" //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
            });
        },
        delete: function () {

        },
        edit: function () {

        },
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template({}));
            // layui.use(['form', 'layedit', 'laydate'], function () {
            //     var form = layui.table;
            //
            //     form.render();
            // });
            layui.use(['table'], function () {
                var table = layui.table;
                table.on('tool', function (obj) {
                    var data = obj.data;
                    if (data.state === obj.event) {
                        layer.msg('当前状态已经是该状态无需修改!');
                    }
                    data = obj.data;
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "/updateProblem",
                        data: {
                            state: obj.event,
                            id: data.id
                        },
                        success: function (rep) {
                            if (rep && rep.code !== undefined) {
                                if (rep.code === 0) {
                                    obj.update({
                                        state: obj.event
                                    });
                                } else {
                                    layer.alert("更新问题状态失败!");
                                }
                            } else {
                                layer.alert("更新问题状态失败!");
                            }
                        },
                        error: function (error) {
                            layer.alert(error);
                        }

                    });
                });
                table.init();
            });
        }
    });
    _content.problemListView = new ProblemListView({
        el: "#root"
    });
});

