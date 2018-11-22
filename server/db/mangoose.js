const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/TimeSheet');
mongoose.connect('mongodb://admin:welcome123@ds259119.mlab.com:59119/timesheet')

module.exports = { mongoose };