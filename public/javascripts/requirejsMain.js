var requireConfig = require = {
    baseUrl: "../javascripts/",
    map: {
        '*': {
            'css': 'require-css', // or whatever the path to require-css is
            'jquery-ui/ui/widget': 'jquery.ui.widget'
        }
    },
    paths: {
        'autocomplete': "autocomplete/jquery.autocomplete",
        'require-css': 'requirejs/css.min',
        'text': 'requirejs/text',
        'jquery': 'jquery/jquery-3.2.1.min',
        'backbone': 'backbone/backbone-min',
        'echarts': 'echarts/echarts.min',
        'china': 'echarts/china',
        'handlebars': 'handlebars/handlebars-v4.0.10',
        'underscore': 'underscore/underscore-min',
        'jquery.fileupload': 'fileupload/jquery.fileupload',
        'jquery.ui.widget': 'fileupload/vendor/jquery.ui.widget',
        'jquery.iframe-transport': 'fileupload/jquery.iframe-transport',
        'layui': 'requirejs/layui.all'
    },
    urlArgs: function (moduleName, url) {
        // if (url.match("\.tpl$") || url.match("\.js$") || url.match("\.css$")) {
        //     return '?v=' + (window.Args ? Args : Math.random());
        // }
        return '';
    },
    waitSeconds: 0,
    shim: {
        'autocomplete': {deps: ['jquery']},
        'china': {deps: ['echarts']},
        'backbone': {deps: ['jquery', 'underscore']},
        'jquery.fileupload': {deps: ['jquery', 'jquery.ui.widget']},
        'jquery.ui.widget': {deps: ['jquery']},
        'layui': {deps: ['jquery', 'css!requirejs/css/layui.css']}
    }
};