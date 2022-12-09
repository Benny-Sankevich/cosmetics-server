function getDateTimeNow() {
    return new Date().toLocaleString();
}
function getToday() {
    const date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
function getTomorrow() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
}
function calculateSumOfArray(sumArray) {
    if (sumArray.length === 0) return 0;
    return sumArray.map(o => o.price).reduce((a, c) => { return a + c });
}
function calculateTotalPriceOfArray(array) {
    if (array.length === 0) return 0;
    return array.map(o => o.totalPrice).reduce((a, c) => { return a + c });
}
function calculateSumInArray(sumArray) {
    if (!sumArray || sumArray.length === 0) return 0;
    return sumArray.map(sum => sum).reduce((a, c) => { return a + c });
}
function calculateTotalPriceOfItem(item) {
    return item.amount * item.price;
}
function chartDataLineAdapter(label, data, borderColor, backgroundColor) {
    return {
        type: 'line', label, data, borderColor, backgroundColor, fill: false
    }
}
function chartDataBarAdapter(label, treatmentId, data, backgroundColor, stack) {
    return {
        type: 'bar', label, treatmentId, data, borderWidth: 1, backgroundColor, stack
    }
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function translationAdapter(translation) {
    return {
        _id: translation._id,
        code: translation.code,
        value: translation.en ? translation.en : translation.he,
    }
}

function getVisibleColumnsYearsList() {
    const currentYear = new Date().getFullYear();
    const minYear = 2020;
    const yearOptions = [];
    for (let year = minYear; year <= currentYear; year++) {
        yearOptions.push(year.toString());
    }
    return yearOptions;
}

module.exports = {
    getDateTimeNow,
    getToday,
    getTomorrow,
    calculateSumOfArray,
    calculateTotalPriceOfArray,
    calculateTotalPriceOfItem,
    calculateSumInArray,
    chartDataLineAdapter,
    chartDataBarAdapter,
    getRandomColor,
    translationAdapter,
    getVisibleColumnsYearsList
}