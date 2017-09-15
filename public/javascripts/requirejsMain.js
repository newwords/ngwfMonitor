var requireConfig = require = {
    baseUrl: "../javascripts/",
    paths: {
        'jquery': 'jquery/jquery-3.2.1',
        'backbone': 'backbone/backbone',
        'echarts': 'echarts/echarts',
        'china': 'echarts/china',
        'handlebars': 'handlebars/handlebars-v4.0.10',
        'underscore': 'underscore/underscore'
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
        'backbone': {deps: ['jquery', 'underscore']}
    }
};