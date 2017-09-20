require(['backbone', 'handlebars', 'text!tpl/updateProblem.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var UpdateProblemListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),
    el: "#root",
    initialize: function () {
      var _this = this;
      _this.$el.html(this.template({}));
      layui.use('form', function () {
        var form = layui.form;
        form.init();
      });
    }
  });
  _content.planListView = new UpdateProblemListView({
    el: "#root"
  });
});
