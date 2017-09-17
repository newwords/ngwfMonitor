require(['backbone', 'handlebars', 'text!tpl/index.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var IndexView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template());
            layui.use(['element'], function () {
                var element = layui.element;
            });
        }
    });
    _content.uploadView = new IndexView({el: "#root"});
    // layui.layer.alert("123");
});
