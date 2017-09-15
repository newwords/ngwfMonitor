var express = require('express');
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
    var form = new multiparty.Form({uploadDir: './public/files/'});
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("error");
        } else {
            console.log("success")
        }
    });
});


module.exports = router;
