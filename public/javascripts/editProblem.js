require(['backbone', 'handlebars', 'text!tpl/editProblem.hbs',
    'layui', 'autocomplete'], function (Backbone, Handlebars, tpl) {
    var _content = this;
    var EditProblemListView = Backbone.View.extend({
        template: Handlebars.compile(tpl),
        el: "#root",
        initialize: function () {
            var _this = this;
            _this.$el.html(this.template({}));
            layui.use('element', function () {
                var element = layui.element;
                console.log(element)
            });
            layui.use(['form', 'layedit', 'laydate'], function () {
                var form = layui.form;
                var layedit = layui.layedit;
                var laydate = layui.laydate;
                form.on('submit', function (data) {
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "/submitProblem",
                        data: data.field,
                        success: function (rep) {
                            if (rep && rep.code !== undefined) {
                                if (rep.code === 0) {
                                    layer.alert("提交成功!");
                                    parent.table.reload("mainProblem");
                                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                                    parent.layer.close(index); //再执行关闭
                                } else if (rep.code === 3) {
                                    layer.alert(rep.message || "提交失败!");
                                }
                            } else {
                                layer.alert("提交失败!");
                            }
                        },
                        error: function (error) {
                            layer.alert(error);
                        }
                    });
                    return false;
                });
                form.render();
                laydate.render({elem: '#problemDate'});
                laydate.render({elem: '#theLatestSettlementDate'});
                laydate.render({elem: '#expectedResolutionDate'});
                $("#taskIdSelect").autocomplete({
                    serviceUrl:"/problemAutocomplete",
                    onSelect: function (suggestion) {
                        $("#taskId").val(suggestion.data);
                    }
                });
            });
        }
    });
    _content.editProblemListView = new EditProblemListView({
        el: "#root"
    });
});
