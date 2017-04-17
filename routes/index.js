var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo'
});

function query(sql, callback) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, function(err, rows) {
            callback(err, rows);
            connection.release(); //释放链接
        });
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/api/test', function(req, res, next) {
    res.json({ title: 'Express' });
});
router.post('/api/reg', function(req, res, next) {
    var data = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.passw
    }
    db.query("insert into user(userName,email,password) values('" + name + "','" + email + "','" + passw + "')", function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({ title: 1 });
        }
    })
});

router.post('/api/search', function(req, res, next) {
    var data = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.passw
    }
    db.query('select * from userinfo', function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({ title: 1 });
        }
    })
});
router.post('/api/del', function(req, res, next) {
    var data = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.passw
    }
    db.query("delete from userinfo where id=" + id, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({ title: 1 });
        }
    })
});
router.post('/api/edit', function(req, res, next) {
    var data = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.passw
    }
    db.query("update userinfo set name='" + name + "',age='" + age + "' where id=" + id, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({ code: 1 });
        }
    })
});
router.post('/search', function(req, res) {
    var name = req.body.s_name;
    var age = req.body.s_age;

    var sql = "select * from userinfo";

    if (name) {
        sql += " and name='" + name + "' ";
    }

    if (age) {
        sql += " and age=" + age + " ";
    }
    sql = sql.replace("and", "where");
    db.query(sql, function(err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.render("users", { title: 'Express', datas: rows, s_name: name, s_age: age });
        }
    });
});


module.exports = router;