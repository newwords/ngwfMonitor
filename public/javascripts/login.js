require(['backbone', 'handlebars', 'text!tpl/login.hbs',
  'layui'], function (Backbone, Handlebars, tpl) {
  var _content = this;
  var LoginView = Backbone.View.extend({
    events: {
      "click #image": "clickImage"
    },
    login: function () {
      //     $.ajax({
      //         url: "/login",
      //         params:
      //         success
      // :
      //
      //     function (rep) {
      //
      //     }
      //
      // ,
      //     error: function (error) {
      //         console.log(error);
      //     }
      // })
      //     ;
    },
    clickImage: function () {
      $.ajax({
        url: "/base64?v=" + Math.random(),
        success: function (base64) {
          $("#image").prop("src", "data:image/png;base64," + base64);
        },
        error: function (error) {
          console.log(error);
        }
      });
    },
    template: Handlebars.compile(tpl),
    initialize: function () {
      var _this = this;
      _this.$el.html(this.template());
      if (localStorage.getItem('user')) {
        var user = localStorage.getItem('user')
        $("#user").val(user)
      }
      if (localStorage.getItem('pwd')) {
        var pwd = localStorage.getItem('pwd')
        $("#pwd").val(pwd)
      }
      this.clickImage();
      layui.use(['form'], function () {
        var form = layui.form;
        form.on('submit', function (data) {
          $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/login",
            data: data.field,
            success: function (rep) {
              if (rep && rep.code !== undefined) {
                if (rep.code === 0) {
                  if ($(".layui-form-checkbox").hasClass('layui-form-checked')) {
                    var user = $("#user").val()
                    var pwd = $("#pwd").val()
                    localStorage.setItem('user', user)
                    localStorage.setItem('pwd', pwd)
                  } else {
                    localStorage.removeItem('user')
                    localStorage.removeItem('pwd')
                  }
                  if("#monitor"===self.location.hash){
                      self.location = '/ngwf/ngwfMonitor.html';
                  }else{
                      self.location = '/ngwf/index.html';
                  }
                } else if (rep.code === 3) {
                  _content.loginView.clickImage();
                  layer.alert(rep.message || "登录失败");
                } else {
                  layer.alert(rep.message || "登录失败");
                }
              } else {
                layer.alert("登录失败");

              }
            },
            error: function (error) {
              layer.alert(error);
            }
          });
          return false;
        });
        form.render();

      });
    }
  });
  _content.loginView = new LoginView({ el: "#root" });
});
