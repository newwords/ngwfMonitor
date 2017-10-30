require(['backbone', 'handlebars', 'text!tpl/modifyPlan.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var modifyPlanListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),
    el: "#root",
    initialize: function () {
      var _this = this;
      if (parent) {
        var data = parent.document.data.data;
        var table = parent.document.table

      }
      var para = {
        id: data.id
      };
      _this.$el.html(this.template({}));
      layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        var layedit = layui.layedit;
        var laydate = layui.laydate;
        form.on('submit', function () {
          var progress = $("#progress").val();
          var startTime = $("#startTime").val();
          var endTime = $("#endTime").val();
          var plannedStartTime = $("#plannedStartTime").val();
          var plannedEndTime = $("#plannedEndTime").val();
          if (progress.indexOf('%') > -1) {
            progress = progress.replace(/%/, '')
            progress = +progress < 1 ? progress : progress / 100;
            para.progress = progress;
          } else if (+progress && +progress < 1) {
            para.progress = progress
          } else {
            para.progress = progress / 100;
          }
          para.plannedStartTime = plannedStartTime;
          para.plannedEndTime = plannedEndTime;
          para.actualStartTime = startTime;
          para.actualEndTime = endTime;
          $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/submitTask",
            data: para,
            success: function (rep) {
              if (rep && rep.code !== undefined) {
                if (rep.code === 0) {
                    parent.table.reload("mainPlan");
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                  //todo 不这么刷新
                  // parent.location.reload();
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

        table.render();
        $("#progress").val(data.progressPercent);
        $("#startTime").val(data.actualStartTime);
        $("#endTime").val(data.actualEndTime);
        laydate.render({ elem: '#startTime' });
        laydate.render({ elem: '#endTime' });
        if(data.isMonitor===true){
            $("#plannedStartTime").val(data.plannedStartTime);
            $("#plannedEndTime").val(data.plannedEndTime);
            laydate.render({ elem: '#plannedStartTime' });
            laydate.render({ elem: '#plannedEndTime' });
        }else{
            $("#plannedStartTimeLayer").hide();
            $("#plannedEndTimeLayer").hide();
        }


        // laydate.render({ elem: '#plannedStartTime' });
        // laydate.render({ elem: '#plannedEndTime' });
      });
    }
  });
  _content.editProblemListView = new modifyPlanListView({
    el: "#root"
  });
});
