const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mangoose');
const { TimeSheet } = require('./model/timeSheet');
const { getWeekMap, addNewTime, updateExistingTime } = require('./utils/dteFillType');
const PORT = process.env.PORT || 8080;

const app = express();
// Middleware to parse the JSON
app.use(bodyParser.json());

// To host static files
app.use(express.static(__dirname +'/../public'));

function saveTimeDetails(timeData, res) {
    const time = new TimeSheet(timeData);
    time.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
}

function updateTimeDetails(data, res) {
    const { week, chargeCodes } = data;
    TimeSheet.findOneAndUpdate({
        week
        }, {$set: {
            week,
            chargeCodes
        }},
        {new: true}
    ).then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
}

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post('/googleTime', (req, res) => {
    // console.log('req: ', req.body.queryResult.parameters);
    const { type, chargecode, hours } = req.body.queryResult.parameters;
    let weekMap = getWeekMap(type);
    TimeSheet.find({week: weekMap.key}).then((times) => {
        console.log('times: ', times);
        if(times && times.length) {
            let data = updateExistingTime(times[0], weekMap, chargecode, hours);
            updateTimeDetails(data, res);
        } else {
            let timeData = addNewTime(weekMap, chargecode, hours);
            saveTimeDetails(timeData, res);
        }
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/getTime', (req, res) => {
    TimeSheet.find().then((times) => {
        res.send({times});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/addTime', (req, res) => {
    const data = {
        week: req.body.week,
        chargeCodes: req.body.chargeCodes
    };

    saveTimeDetails(data, res);
});

app.patch('/updateTime', (req, res) => {
    const {week, chargeCodes} = req.body;
    updateTimeDetails(req.body, res);
});

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
});