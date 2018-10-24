var pool = require('./pool.js');
var express = require('express');
var mysql = require('mysql');

var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//CORS
var cors = require('cors');

app.set('view engine', 'ejs');

//CORS to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'CMPE2723',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

//Allow Access Control 
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Request-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
})


//MySql Connection..

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'studentinformationsystem'
// });

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log('Connected!');
// });




//Login Validation
app.post('/login', function (req, res) {

    console.log('Inside Login Post!');
    console.log('Request Body: ', req.body);


    var sql = 'SELECT * from logincredentials WHERE username = ' + mysql.escape(req.body.username) +
        'and Password = ' + mysql.escape(req.body.password);
    pool.getConnection(function (err, conn) {

        if (err) {
            console.log('Could not connect to pool');
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });
            res.end('Could not connect to pool');
            console.log('Error while Connection creation!');
        }
        else {
            conn.query(sql, function (err, result) {

                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('INvalid Credentials!');
                }
                else {
                    if(result.length > 0){
                        req.session.user = req.body.username;
                    res.cookie('cookie', 'admin', {
                        maxAge: 3600000,
                        httpOnly: false,
                        path: '/'
                    });
                    res.writeHead(200, {
                        'Content-type': 'text/plain'
                    })
                    console.log('Login success! Redirecting to Home Page');
                    res.end('Successful Login');
                    }
                    
                }
                conn.release();
            });
        }

    });


});

//Add User
app.post('/adduser', function (req, res) {

    if (!req.session.user) {
        console.log('Not a Logged in User. Redirecting to Login Page');
        res.end('Validation Failure');
    }
    else {
        console.log('Inside Add User Post!');
        console.log('Request Body: ', req.body);

        pool.getConnection(function (err, conn) {
            if (err) {
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                })
                res.end('Error while Connection creation!');
                console.log('Error while Connection creation!');
            }
            else {

                //Insert query
                var sql = 'INSERT INTO userdetails values(' + mysql.escape(req.body.StudentId) + ',' +
                    mysql.escape(req.body.Name) + ',' + mysql.escape(req.body.Department) + ')';

                conn.query(sql, function (err, result) {

                    if (err) {

                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        })
                        res.end('Error while User Creation!');
                    }
                    else {
                        console.log('User Creation Successful!')
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        res.end('Redirecting to User Report Page');
                    }
                    conn.release();
                });
                

            }
        });




    }
});


//Get Users to display

app.get('/user-report', function (req, res) {

    if (!req.session.user) {
        console.log('Not a Logged in User. Redirecting to Login Page');
        res.end('Validation Failure');
    }
    else {
        console.log('Inside User Report - GET');

        pool.getConnection(function (err, conn) {

            if (err) {
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                })
                res.end('Error while Connection creation!');
                console.log('Error while Connection creation!');
            }
            else {
                var sql = 'SELECT * from userdetails';

                conn.query(sql, function (err, result) {

                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        })
                        res.end('Error while User Report generation');
                    }
                    else {
                        res.writeHead(200, {
                            'Content-type': 'application/json'
                        });
                        console.log("Students : ", result);
                        console.log("Students : ", JSON.stringify(result));
                        res.end(JSON.stringify(result));
                    }
                    conn.release();
                });
            }
        });
    }
});


//Delete a user

app.post('/delete', function (req, res) {

    if (!req.session.user) {
        console.log('Not a Logged in User. Redirecting to Login Page');
        res.end('Validation Failure');
    }
    else {

        console.log('Inside Delete - POST');
        console.log("Student ID : ", JSON.stringify(req.body.studentId));

        //Delete query
        pool.getConnection(function (err, conn) {
            if (err) {
                res.writeHead(400, {
                    'Content-type': 'text/plain'
                })
                res.end('Error while Connection creation!');
                console.log('Error while Connection creation!');
            }
            else {
                var sql = 'DELETE from userdetails WHERE StudentId = ' + mysql.escape(req.body.studentId);
                conn.query(sql, function (err, result) {

                    if (err) {
                        res.writeHead(400, {
                            'Content-type': 'text/plain'
                        })
                        res.end('Delete failed!');
                    }
                    else {
                        res.writeHead(200, {
                            'Content-type': 'text/plain'
                        });
                        console.log('Delete completed!');
                        res.end('Delete Successful');
                    }
                    conn.release();
                });
            }
        });


    }
});


app.listen(3005);