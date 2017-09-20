require(['backbone', 'handlebars', 'text!tpl/plan.hbs',
    'layui'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var PlanListView = Backbone.View.extend({
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
    _content.planListView = new PlanListView({
        el: "#root"
    });
});

