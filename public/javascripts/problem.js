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

