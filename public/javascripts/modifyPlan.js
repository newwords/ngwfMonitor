require(['backbone', 'handlebars', 'text!tpl/modifyPlan.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var modifyPlanListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),
    el: "#root",
    initialize: function () {
      var _this = this;
      _this.$el.html(this.template({}));
      layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        var layedit = layui.layedit;
        var laydate = layui.laydate;
        form.on('submit', function (data) {
          console.log(data)

          $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/submitTask",
            data: { field: field, value: value, id: id },
            success: function (rep) {
              if (rep && rep.code !== undefined) {
                if (rep.code === 0) {
                  layui.layer.closeAll()
                } else if (rep.code === 3) {
                  layer.alert("修改计划失败!");

                }
              } else {
                layer.alert("修改计划失败!");
              }
            },
            error: function (error) {
              layer.alert(error);
            }
          });
          return false;
        });
        form.render();
        laydate.render({ elem: '#startTime' });
        laydate.render({ elem: '#endTime' });
      });
    }
  });
  _content.editProblemListView = new modifyPlanListView({
    el: "#root"
  });
});
