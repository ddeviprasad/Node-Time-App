const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mangoose");
const { TimeSheet } = require("./model/timeSheet");
const {
  getWeekMap,
  addNewTime,
  updateExistingTime
} = require("./utils/dteFillType");
const PORT = process.env.PORT || 8080;

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

/**
 * Socket for real time updates
 */

io.on("connection", () => {
  console.log("Client Connected");
});

let response = {
  "fulfillmentText": "This is a text response",
  "fulfillmentMessages": [
    {
      "card": {
        "title": "card title",
        "subtitle": "card text",
        "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
        "buttons": [
          {
            "text": "button text",
            "postback": "https://assistant.google.com/"
          }
        ]
      }
    }
  ],
  "source": "example.com",
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Time sheet updated successfully"
            }
          }
        ]
      }
    },
    "facebook": {
      "text": "Hello, Facebook!"
    },
    "slack": {
      "text": "This is a text response for Slack."
    }
  },
  "outputContexts": [
    {
      "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/context name",
      "lifespanCount": 5,
      "parameters": {
        "param": "param value"
      }
    }
  ],
  "followupEventInput": {
    "name": "event name",
    "languageCode": "en-US",
    "parameters": {
      "param": "param value"
    }
  }
};

// Middleware to parse the JSON
app.use(bodyParser.json());

// To host static files
app.use(express.static(__dirname + "/../public"));

function onDbUpdate(data = {}) {
  io.emit("db-update", data);
}
function saveTimeDetails(timeData, res) {
  const time = new TimeSheet(timeData);
  time.save().then(
    doc => {
      res.send(response);
      onDbUpdate();
    },
    err => {
      res.status(400).send(err);
    }
  );
}

function updateTimeDetails(data, res) {
  const { week, chargeCodes } = data;
  TimeSheet.findOneAndUpdate(
    {
      week
    },
    {
      $set: {
        week,
        chargeCodes
      }
    },
    { new: true }
  ).then(
    doc => {
      onDbUpdate();
      res.send(response);
    },
    err => {
      res.status(400).send(err);
    }
  );
}

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/googleTime", (req, res) => {
  // console.log('req: ', req.body.queryResult.parameters);
  const { type, chargeCode, hours } = req.body.queryResult.parameters;
  let weekMap = getWeekMap(type);
  TimeSheet.find({ week: weekMap.key }).then(
    times => {
      console.log("times: ", times);
      if (times && times.length) {
        let data = updateExistingTime(times[0], weekMap, chargeCode, Number(hours));
        updateTimeDetails(data, res);
      } else {
        let timeData = addNewTime(weekMap, chargeCode, Number(hours));
        saveTimeDetails(timeData, res);
      }
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get("/getTime", (req, res) => {
  TimeSheet.find().then(
    times => {
      res.send({ times });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.post("/addTime", (req, res) => {
  const data = {
    week: req.body.week,
    chargeCodes: req.body.chargeCodes
  };

  saveTimeDetails(data, res);
});

app.patch("/updateTime", (req, res) => {
  const { week, chargeCodes } = req.body;
  updateTimeDetails(req.body, res);
});

http.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
