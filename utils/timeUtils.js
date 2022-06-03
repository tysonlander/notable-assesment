const moment = require('moment')

const isOn15MinIncrement = (momentDateTime) => {
    const min = momentDateTime.minutes()
    if(min === 0 || min === 15 || min === 30 || min === 45)
        return true
}

const clearTimeAfterMin = (momentDateTime) => {
    momentDateTime.second(0).millisecond(0);
}

module.exports = { isOn15MinIncrement, clearTimeAfterMin }