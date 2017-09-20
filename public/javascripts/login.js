require(['backbone', 'handlebars', 'text!tpl/login.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var IndexView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template());

            $.ajax({
                url: "/base64",
                success: function (base64) {
                    $("#image").prop("src", "data:image/png;base64," + base64);
                },
                error: function (error) {
                    console.log(error);
                }
            });

            layui.use(['form'], function () {
                var form = layui.form;
                form.render();

            });
        }
    });
    _content.uploadView = new IndexView({el: "#root"});
    // layui.layer.alert("123");
});
