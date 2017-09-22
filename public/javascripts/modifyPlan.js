require(['backbone', 'handlebars', 'text!tpl/modifyPlan.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var modifyPlanListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),
    el: "#root",
    initialize: function () {
      var _this = this;
      if (parent) {
        var data = parent.document.data;
        var table = parent.document.table
        $("#progress").val(data.progressPercent)
        $("#startTime").val(data.plannedStartTime)
        $("#endTime").val(data.plannedEndTime)
        $("#plannedStartTime").val(data.actualStartTime);
        $("#plannedEndTime").val(data.actualEndTime);
      }
      var para = {
        id: data.data.id
      }
      _this.$el.html(this.template({}));
      layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        var layedit = layui.layedit;
        var laydate = layui.laydate;
        form.on('submit', function () {
          var progress = $("#progress").val()
          var startTime = $("#startTime").val()
          var endTime = $("#endTime").val()
          var plannedStartTime = $("#plannedStartTime").val();
          var plannedEndTime = $("#plannedEndTime").val();
          para.progress = progress;
          para.plannedStartTime = plannedStartTime;
          para.plannedEndTime = plannedEndTime;
          para.actualStartTime = startTime;
          para.actualEndTime = endTime;
          console.log(para)
          $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/submitTask",
            data: para,
            success: function (rep) {
              console.log(rep)
              if (rep && rep.code !== undefined) {
                if (rep.code === 0) {
                  var index = parent.layer.getFrameIndex(window.name);
                  parent.layer.close(index)
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
        table.render();
        laydate.render({ elem: '#startTime' });
        laydate.render({ elem: '#endTime' });
        laydate.render({ elem: '#plannedStartTime' });
        laydate.render({ elem: '#plannedEndTime' });
      });
    }
  });
  _content.editProblemListView = new modifyPlanListView({
    el: "#root"
  });
});
