require(['backbone', 'handlebars', 'text!tpl/password.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var PasswordView = Backbone.View.extend({
        events: {
            "click #image": "clickImage"
        },
        template: Handlebars.compile(tpl),
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template());
            layui.use(['form'], function () {
                $.ajax({
                    url: "/whoAmI",
                    success: function (rep) {
                        if (rep && rep.code !== undefined) {
                            if (rep.code === 0) {
                                _this.$el.find("#_username").val(rep.message);
                            } else {
                                layer.alert(rep.message);
                            }
                        } else {
                            layer.alert("获取用户信息错误");
                        }
                    },
                    error: function (error) {
                        layer.alert(error);
                    }
                });
                var form = layui.form;
                form.verify({
                    pass: [/(.+){6,12}$/, '密码必须6到12位']
                });
                form.on('submit', function (data) {
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "/password",
                        data: data.field,
                        success: function (rep) {
                            if (rep && rep.code !== undefined) {
                                if (rep.code === 0) {
                                    layer.alert("密码修改成功", function () {
                                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                        parent.layer.close(index); //再执行关闭
                                    });
                                } else {
                                    layer.alert(rep.message);
                                }
                            } else {
                                layer.alert("密码修改失败");
                            }
                        },
                        error: function (error) {
                            layer.alert(error);
                        }
                    });
                    return false;
                });
                form.render();

            });
        }
    });
    _content.passwordView = new PasswordView({el: "#root"});
});
