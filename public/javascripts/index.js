require(['backbone', 'handlebars', 'text!tpl/index.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var IndexView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        events: {
            "click #logoff": "logoff",
            "click #changePassword":"changePassword"
        },
        changePassword:function () {
            layui.layer.open({
                type: 2,
                title: '密码修改',
                area: ['400px', '250px'],
                content: "/ngwf/password.html"
            });
        },
        logoff: function () {
            $.ajax({
                url: "/logoff",
                success: function (rep) {
                    location.href = "/";
                },
                error: function (error) {
                    location.href = "/";
                }
            });
        },
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template());
            layui.use(['element'], function () {
                var element = layui.element;
                element.init();
            });
        }
    });
    _content.uploadView = new IndexView({el: "#root"});
    // layui.layer.alert("123");
});
