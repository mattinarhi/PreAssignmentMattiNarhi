const express = require('express');
const app = express();
const mysql = require('mysql');

const morgan = require('morgan');

const bodyParser = require('body-parser');


app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

var connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    password: 'root',
    database: 'sensordata'
});



connection.connect(function (err) {

    if(!err) {

        console.log("Database is connected");
    }

    else {

        console.log("Something went wrong");
    }

});

app.get('/', (req,res) => {

    res.sendFile('./Webpage/PreAssignment.html', {root: __dirname} );


});

app.post('/', function(req, res) {

    var jsondata = req.body;
    var values = [];

    console.log(jsondata);


    values.push([jsondata.date, jsondata.sensor1, jsondata.sensor2, jsondata.sensor3, jsondata.sensor4]);


    connection.query('INSERT IGNORE INTO sensors (datatime, sensor1, sensor2, sensor3, sensor4) VALUES ?', [values], function (err, result) {
        if (err) {
            console.log('Error');
        } else {
            console.log('Success');
        }
    });
});






app.get('/data', (req, res) => {
    connection.query("SELECT * FROM sensors", function (err, result) {

        if (err) throw err;
        else {

            res.write("<table style='border-radius: 1em; border: black solid'>");
            res.write("<tr>");
           for (var column in result[0]) {
                res.write("<td><label>" + column + "</label></td>");
            }
            res.write("</tr>");
            for (var row in result) {
                res.write("<tr>");
                for (var column in result[row]) {
                    res.write("<td><label>" + result[row][column] + "</label></td>");
                }
                res.write("</tr>");
            }
            res.write("</table>");
            res.end();
        }
    });
});




var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
});