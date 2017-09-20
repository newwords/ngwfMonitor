require(['backbone', 'handlebars', 'text!tpl/problem.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var ProblemListView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        el: "#root",
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template({}));
            layui.use('table', function () {
                var table = layui.table;
                table.init();

            });
        }
    });
    _content.problemListView = new ProblemListView({
        el: "#root"
    });
});

