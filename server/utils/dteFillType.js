function getWeekKey(date) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 6 - newDate.getDay());
    return newDate.toDateString();
}

function fillTimeForDay(chargeCode, hours, day) {
    let newTime = {
        code: chargeCode,
        hours: [
            {value: 0},
            {value: 0},
            {value: 0},
            {value: 0},
            {value: 0},
            {value: 0},
            {value: 0}
        ]
    };
    newTime.hours[day].value = hours;
    return newTime;
}

function fillTimeForWeek(chargeCode, hours) {
    let newTime = {
        code: chargeCode,
        hours: [
            {value: 0},
            {value: hours},
            {value: hours},
            {value: hours},
            {value: hours},
            {value: hours},
            {value: 0}
        ]
    };
    return newTime;
}

function addNewTime(weekMap, chargecode, hours) {
    const { isWeekly, key, day } = weekMap;
    let newTime = {
        week: key,
        chargeCodes: []
    };
    let timeSet;
    if (isWeekly) {
        timeSet = fillTimeForWeek(chargecode, hours);
    } else {
        timeSet = fillTimeForDay(chargecode, hours, day);
    }
    newTime.chargeCodes.push(timeSet);
    return newTime;
}

function updateExistingTime(data, weekMap, chargecode, hours) {
    const { chargeCodes } = data;
    console.log('chargeCodes: ', chargeCodes);
    const { isWeekly, day } = weekMap;
    if(chargeCodes.length) {
        for(let i = chargeCodes.length - 1; i >= 0; i--) {
           // console.log(chargeCodes);
            if (chargeCodes[i].code === String(chargecode).trim()) {
                if (isWeekly) {
                    data.chargeCodes[i] = fillTimeForWeek(chargecode, hours);
                } else {
                    data.chargeCodes[i].hours[day] = { value: hours };
                }
                return data;
            }
        }
    }
    let newTime;
    if(isWeekly) {
        newTime = fillTimeForWeek(chargecode, hours);
    } else {
        newTime = fillTimeForDay(chargecode, hours, day)
    }
    data.chargeCodes.push(newTime);
    return data;
}

function getWeekMap(type) {
    let date = new Date();
    let weekly = false;
    switch(type) {
        case 'yesterday':
            date.setDate(date.getDate() - 1);
            break;
        case 'tomorrow':
            date.setDate(date.getDate() + 1);
            break;
        case 'today':
            weekly = false;
            break;
        case 'lastweek':
            date.setDate(date.getDate() - 7);
            weekly = true;
            break;
        default:
            date = new Date();
            weekly = true;
    }
    return {
        key: getWeekKey(date),
        isWeekly: weekly,
        day: date.getDay()
    };
}

module.exports = {
    getWeekMap,
    getWeekKey,
    addNewTime,
    fillTimeForWeek,
    updateExistingTime
}

