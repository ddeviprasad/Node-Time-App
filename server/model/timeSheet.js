const mongoose = require('mongoose');

// Create a Model
const TimeSheet = mongoose.model('TimeSheet', {
    week: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    chargeCodes: [
        {
            code: {
                type: String,
                required: true,
                trim: true
            },
            hours: {
                type: Array,
                length: 7
            }
        }
    ]
});

module.exports = { TimeSheet };