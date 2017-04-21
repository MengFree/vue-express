var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');

var db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo'
});

function getSql(type, table, data) {
    if (type == 'add') {
        var str = "insert into " + table;
        var val = [];
        var keyGen = [];
        for (var key in data) {
            val.push('"' + data[key] + '"');
            keyGen.push(key);
        }
        str += "(" + keyGen.join(',') + ") values(" + val.join(',') + ")";
        return str;
        // "(userName,email,password) values('" + userName + "','" + email + "','" + passw + "')"
    }
    if (type == 'search') {
        var str = "select * from " + table + " ";
        for (var key in data) {
            str += `and ${key}=${data[key]} `;
        }
        str = str.replace("and", "where");
        return str;
    }
}

function query(sql, data, callback) {
    db.getConnection(function(err, connection) {
        // Use the connection
        if (typeof data === 'function') {
            callback = data;
            var de = connection.query(sql, function(err, rows) {
                callback(err, rows);
                connection.release(); //释放链接
                console.log(de.sql);
                console.log(JSON.stringify(rows))
            });
        } else {
            var de = connection.query(sql, data, function(err, rows) { //使用？占位费转义
                callback(err, rows);
                connection.release(); //释放链接
                console.log(de.sql);
                console.log(JSON.stringify(rows))
            });
        }

    });
}
/* GET home page. */
router.all('/', function(req, res, next) {
    console.log(req.query);
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
    var sql_search = getSql('search', 'user', { userName: req.body.name });
    async.auto({
        check: function(cb) { //检查用户名是否重复
            query(sql_search, function(err, rows) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    if (rows.length) {
                        cb('repeat');
                    } else {
                        cb(null, true)
                    }
                }
            })
        },
        reg: ['check', function(result, cb) {
            var sql_reg = getSql('add', 'user', data);
            query(sql_reg, function(err, rows) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, rows);
                }
            })
        }]
    }, function(err, results) {
        if (err) {
            if (err == 'repeat') return res.json({ code: -101, msg: '用户名重复' });
            return res.json({ code: -1, msg: '系统请求出错' })
        }
        console.log(results.reg.insertId);
        return res.json({ code: 1, msg: '注册成功', userId: results.reg.insertId })
    })


});
router.post('/api/login', function(req, res, next) {
    var data = {
        userName: req.body.name,
        password: req.body.passw
    }
    var sql = `select * from user where userName='${data.userName}'`;
    query(sql, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1, msg: '系统请求出错' });
        } else {
            if (rows[0].password == data.password) {
                res.json({ code: 1, userId: rows[0].userId, msg: '登录成功' });
                req.session.user = rows[0];
            } else {
                res.json({ code: -111, msg: '密码错误' });
            }
        }
    })
});

router.post('/api/add', function(req, res, next) {
    var now = new Date();
    console.log(now, now.getTime());
    var data = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status || 0,
        creatTime: now.getTime(),
        userId: req.body.userId,
    }
    for (var key in data) {
        if (key != 'status' && !data[key]) {
            return res.json({ code: -201, msg: key + ' is request ！' });
        }
    }
    // var sql_add = getSql('add', 'action', data);
    // console.log('添加todo', sql_add);
    async.auto({
        add: function(cb) {
            var sql_add = 'INSERT INTO action SET ?'
            query(sql_add, data, function(err, rows) {
                if (err) {
                    cb(err);
                    console.log(err);
                } else {
                    cb(null, rows.insertId);
                }
            })
        },
        query: ['add', function(result, cb) {
            var sql_get = getSql('search', 'action', { id: result.add });
            query(sql_get, function(err, rows) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb(null, rows);
                }
            })
        }]
    }, function(err, results) {
        if (err) {
            return res.json({ code: -1, msg: '系统请求出错' })
        }
        res.json({ code: 200, data: results.query[0] });
    })
});
router.post('/api/getList', function(req, res, next) {
    var page = req.body.page || 1;
    var pageSize = 5;
    var index = (page - 1) * pageSize;
    var sql_search = getSql('search', 'action', { userId: req.body.userId });
    sql_search += `order by id DESC limit ${index},${pageSize}`;
    query(sql_search, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            console.log(req.session.user);
            res.json({
                code: 1,
                list: rows
            });
        }
    })
});
router.post('/api/done', function(req, res, next) {
    var sql_search = "update action set status='" + req.body.val + "' where id=" + req.body.id;
    query(sql_search, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({
                code: 200,
                msg: 'done　！！'
            });
        }
    })
});
router.post('/api/del', function(req, res, next) {
    var sql_del = "delete from action where id=" + req.body.id;
    query(sql_del, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({
                code: 200,
                msg: 'delete !!!'
            });
        }
    })
});
router.post('/api/edit', function(req, res, next) {
    var now = new Date();
    if (!req.body.content) {
        return res.json({ code: -101, msg: 'requst content!' })
    }
    if (!req.body.title) {
        return res.json({ code: -101, msg: 'requst title!' })
    }
    var sql_search = `update action set content='${req.body.content}',title='${req.body.title}',updateTime=${now.getTime()} where id=${req.body.id}`;
    async.auto({
        edit: function(cb) {
            query(sql_search, function(err, rows) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb(null, rows);
                }
            })
        },
        query: ['edit', function(result, cb) {
            var sql_get = getSql('search', 'action', { id: req.body.id });
            query(sql_get, function(err, rows) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb(null, rows);
                }
            })
        }]
    }, function(err, results) {
        if (err) {
            return res.json({ code: -1, msg: '系统请求出错' })
        }
        res.json({ code: 200, data: results.query[0] });
    })
});
router.post('/api/search', function(req, res, next) {
    var sql_del = "SELECT * from action  WHERE title LIKE '%" + req.body.keyWord + "%' or content LIKE '%" + req.body.keyWord + "%'";
    query(sql_del, function(err, rows) {
        if (err) {
            console.log(err);
            res.json({ code: -1 });
        } else {
            res.json({
                code: 200,
                msg: 'search !!!',
                list: rows
            });
        }
    })
});








router.post('/api/search', function(req, res, next) {
    var data = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.passw
    }
    query('select * from userinfo', function(err, rows) {
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
    query("delete from userinfo where id=" + id, function(err, rows) {
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
    query("update userinfo set name='" + name + "',age='" + age + "' where id=" + id, function(err, rows) {
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
    query(sql, function(err, rows) {
        if (err) {
            res.end("查询失败：", err)
        } else {
            res.render("users", { title: 'Express', datas: rows, s_name: name, s_age: age });
        }
    });
});


module.exports = router;