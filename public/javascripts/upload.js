require(['backbone', 'province', 'layui', 'jquery.fileupload', 'jquery.iframe-transport'], function (Backbone, province) {
    var _content = this;
    var UploadView = Backbone.View.extend({
        initialize: function () {

        }
    });
    _content.uploadView = new UploadView({});
    layui.layer.alert("123");
});
