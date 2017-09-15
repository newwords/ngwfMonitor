var requireConfig = require = {
    baseUrl: "../javascripts/",
    map: {
        '*': {
            'css': 'require-css', // or whatever the path to require-css is
            'jquery-ui/ui/widget': 'jquery.ui.widget'
        }
    },
    paths: {
        'require-css': 'requirejs/css',
        'text': 'requirejs/text',
        'jquery': 'jquery/jquery-3.2.1',
        'backbone': 'backbone/backbone',
        'echarts': 'echarts/echarts',
        'china': 'echarts/china',
        'handlebars': 'handlebars/handlebars-v4.0.10',
        'underscore': 'underscore/underscore',
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
        'china': {deps: ['echarts']},
        'backbone': {deps: ['jquery', 'underscore']},
        'jquery.fileupload': {deps: ['jquery', 'jquery.ui.widget']},
        'jquery.ui.widget': {deps: ['jquery']},
        'layui': {deps: ['jquery']}
    }
};