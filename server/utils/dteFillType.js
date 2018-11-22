function getWeekKey(date) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate + 6 - newDate.getDay);
    return newDate.toDateString();
}

function fillTime() {

}

// function fillHoures() {
//     let code = {
//         code: '',
//         hours: [
//             {value: 0},
//             {value: 0},
//             {value: 0},
//             {value: 0},
//             {value: 0},
//             {value: 0},
//             {value: 0}
//         ]
//     };
// }

function fillTimeForWeek(chargeCode, key) {
    let newTime = {
        week: key,
        chargeCodes: [
            {
                code: chargeCode,
                hours: [
                    {value: 0},
                    {value: 9},
                    {value: 9},
                    {value: 9},
                    {value: 9},
                    {value: 9},
                    {value: 9}
                ]
            }
        ]
    };
    return newTime;
}

function getMapping(dteFor, chargeCode) {
    switch(dteFor) {
        case 'today':
            // TODO
            break;
        case 'yesterday':
            // TODO
            break;
        case 'tommorow':
            // TODO
            break;
        case 'last week':
            // TODO
            break;
        default:
            let key = getWeekKey(new Date());
            return fillTimeForWeek(chargeCode, key);
    }
}

module.exports = {
    getWeekKey,
    fillTime,
    getMapping
}

