require("../data-access-layer/dal");
const AppointmentAvailableModel = require("../models/appointments/appointments-available-model");
const appointmentLogic = require("./appointment-logic");
const helpers = require("../helpers/helpers");

function getAllAppointmentAvailableAsync() {
    return AppointmentAvailableModel.find({
        $and: [{ isActive: true }, {
            dateTimeStart: {
                $gte: helpers.getToday(),
            }
        }]
    }).sort({ dateTimeStart: 1 }).exec();
}

function addAppointmentAvailableAsync(appointmentAvailable) {
    appointmentAvailable.createdDate = helpers.getDateTimeNow();
    return appointmentAvailable.save();
}

function updateAppointmentAvailableAsync(appointmentAvailable) {
    appointmentAvailable.lastModified = helpers.getDateTimeNow();
    return AppointmentAvailableModel.findByIdAndUpdate(appointmentAvailable._id, appointmentAvailable, { returnOriginal: false }).exec();
}

async function deleteAppointmentAvailableAsync(appointmentAvailable) {
    appointmentAvailable.isActive = false;
    return await updateAppointmentAvailableAsync(appointmentAvailable);
}

async function onAddAppointmentAvailableByRangeAsync(date, timeStart, timeEnd, duration) {
    const startRange = getTimeRange(timeStart);
    const endRange = getTimeRange(timeEnd)

    if (isStartRangeLaterThanEndRange(startRange, endRange)) {
        return 'The start range must be earlier than the end range';
    }
    if (isTimesNotMatchedByTheDuration(startRange, endRange, duration)) {
        return `The times isn't matched by the duration`;
    }
    if (await isExistAppointmentsBetweenRange(date, startRange, endRange)) {
        return 'There is an appointment inside the range';
    }

    return await saveAppointmentAvailableByRangeAsync(date, startRange, endRange, duration)
}

async function saveAppointmentAvailableByRangeAsync(date, startRange, endRange, duration) {
    let responseData = [];
    const minutesOfAnHour = 60;
    while (isInsideTheRange(startRange, endRange)) {
        while (startRange.minutes < minutesOfAnHour && isInsideTheRange(startRange, endRange)) {
            const appointmentAvailable = await createNewAppointmentAvailableObject(date, startRange, duration, minutesOfAnHour);
            responseData.push(await addAppointmentAvailableAsync(appointmentAvailable));
            startRange.minutes += duration;
        }
        startRange.minutes = (startRange.minutes) % minutesOfAnHour;
        startRange.hours++
    }
    return responseData;
}

async function isExistAppointmentsBetweenRange(date, startRange, endRange) {
    const appointmentsExist = await appointmentLogic.checkAppointmentsBetweenRangeAsync(getDateTime(date, startRange.hours, startRange.minutes), getDateTime(date, endRange.hours, endRange.minutes));
    return appointmentsExist.length > 0 ? true : false;
}

function isStartRangeLaterThanEndRange(startRange, endRange) {
    return startRange.hours > endRange.hours || startRange.hours == endRange.hours && startRange.minutes >= endRange.minutes ? true : false;
}

function isTimesNotMatchedByTheDuration(startRange, endRange, duration) {
    return Math.abs(startRange.minutes - endRange.minutes) % duration != 0 && Math.abs(startRange.minutes - endRange.minutes) % duration != duration ? true : false;
}

function isInsideTheRange(startRange, endRange) {
    return startRange.hours < endRange.hours || startRange.hours == endRange.hours && startRange.minutes < endRange.minutes ? true : false;
}

function createNewAppointmentAvailableObject(date, startRange, duration, minutesOfAnHour) {
    const endMinute = (startRange.minutes + duration) % minutesOfAnHour;
    const endHour = (startRange.minutes + duration) >= minutesOfAnHour ? startRange.hours + 1 : startRange.hours;
    return new AppointmentAvailableModel({
        dateTimeStart: getDateTime(date, startRange.hours, startRange.minutes),
        dateTimeEnd: getDateTime(date, endHour, endMinute),
    });
}

function getDateTime(strDate, hours, minutes) {
    const date = new Date(strDate);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
}

function getTimeRange(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    return { hours: +hours, minutes: +minutes }
}

module.exports = {
    getAllAppointmentAvailableAsync,
    onAddAppointmentAvailableByRangeAsync,
    addAppointmentAvailableAsync,
    updateAppointmentAvailableAsync,
    deleteAppointmentAvailableAsync
}
