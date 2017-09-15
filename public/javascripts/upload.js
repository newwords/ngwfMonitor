require(['backbone', 'handlebars', 'province', 'text!tpl/upload.hbs',
    'layui'], function (Backbone, Handlebars, province, tpl) {
    var _content = this;
    var UploadView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template({province: province}));
            layui.use(['form', 'upload'], function () {
                var form = layui.form,
                    upload = layui.upload;
                _this._upload = upload.render({
                    elem: '#selectFile'
                    , url: '/upload/'
                    , accept: 'file' //普通文件
                    , exts: 'xls|xlsx' //只允许上传excel
                    , auto: false
                    //,multiple: true
                    , bindAction: '#upload'
                    , done: function (res) {
                        console.log(res)
                    }
                    , before: function (obj) {
                        var province = $("#province").val();
                        _this._upload.config.data = {province: province};
                    }
                });
                _this._form = form.render();
            });
        }
    });
    _content.uploadView = new UploadView({el: "#root"});
    // layui.layer.alert("123");
});
