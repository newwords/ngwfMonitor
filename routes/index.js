var express = require('express');
var xlsx = require("node-xlsx");
var util = require('util');
var router = express.Router();
var multiparty = require('multiparty');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/* AJAX handle*/
router.get('/ajax', function (req, res, next) {


});

/* UPLOAD handle*/
router.post('/upload', function (req, res, next) {
    var form = new multiparty.Form();
    form.on('field', function (name, value) {
        if (name === 'province') {

        }
    });
    form.on('part', function (part) {
        console.log("province:", province);
        res.end("OK");
    });
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw new Error("form is error");
        }
        var filepath = files.file[0].path;
        var workbook = xlsx.parse(filepath);
        console.log(workbook);
    });
});


module.exports = router;
