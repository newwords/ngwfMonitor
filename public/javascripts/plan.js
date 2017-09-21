require(['backbone', 'handlebars', 'text!tpl/plan.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var PlanListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),
    el: "#root",
    events: {
      "click #modify": "modify"
    },
    initialize: function () {
      var _this = this;
      _this.$el.html(this.template({}));
      layui.use(['table', 'element'], function () {
        var table = layui.table;
        table.on('tool', function (data) {
          document.data = data
          document.table = table
          layer.open({
            type: 2,
            title: '',
            offset: '100px',
            area: ['500px', '400px'],
            content: "/ngwf/modifyPlan.html"
          })
        });
        table.on('edit', function (obj) {
          console.log('obj是' + obj);
          console.log(obj.value); //得到修改后的值
          console.log(obj.field); //当前编辑的字段名
          console.log(obj.data); //所在行的所有相关数据
          var field = obj.field;
          var value = obj.value;
          if ("progressPercent" === obj.field) {
            field = "progress";
            value = (value.replace("%", "") * 1 / 100)
          }
          var id = obj.data.id;
          $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/submitTask",
            data: {
              field: field,
              value: value,
              id: id
            },
            success: function (rep) {
              if (rep && rep.code !== undefined) {
                if (rep.code === 0) {

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
        });
        table.init();
      });
    }
  });
  _content.planListView = new PlanListView({
    el: "#root"
  });
});
