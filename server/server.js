const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mangoose');
const { TimeSheet } = require('./model/timeSheet');
const { getMapping } = require('./utils/dteFillType');
const PORT = process.env.PORT || 8080;

const app = express();
// Middleware to parse the JSON
app.use(bodyParser.json());

// To host static files
app.use(express.static(__dirname +'/../public'));

function saveTimeDetails(timeData) {
    const time = new TimeSheet(timeData);
    time.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
}

function updateTimeDetails(id, week, chargeCodes) {
    TimeSheet.findByIdAndUpdate({
        _id: id
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
    const { dteFor, chargeCode } = req.body;
    let data = getMapping(dteFor, chargeCode);
    TimeSheet.find({week: data.week}).then((times) => {
        console.log('times: ', times);
        if(times && times.length) {
            updateTimeDetails(times[0]._id, data.week, data.chargeCodes);
        } else {
            saveTimeDetails(data);
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
    saveTimeDetails(data);
});

app.patch('/updateTime', (req, res) => {
    const {week, chargeCodes} = req.body;
    updateTimeDetails(req.body._id, week, chargeCodes);
});

app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
});