require("../data-access-layer/dal");
const TranslationModel = require("../models/translation-model");
const ColorsModel = require("../models/colors-model");
const LogModel = require("../models/log-model");
const helpers = require("../helpers/helpers");

async function getAllTranslationsByLanguageCodeAsync(languageCode) {
    const dbTranslationList = await TranslationModel.find().select(['code', languageCode]).exec();
    const translations = dbTranslationList.map(translation => helpers.translationAdapter(translation));
    return translations;
}

function addTranslationAsync(translation) {
    translation.createdDate = helpers.getDateTimeNow();
    return translation.save();
}

function getAllColorsAsync() {
    return ColorsModel.find().exec();
}

function saveLogAsync(log) {
    log.save();
}

module.exports = {
    getAllTranslationsByLanguageCodeAsync,
    addTranslationAsync,
    getAllColorsAsync,
    saveLogAsync
}