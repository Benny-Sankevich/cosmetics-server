function getError(err) {
    if (process.env.NODE_ENV === "production") {
        return "Some error occurred, please try again.";
    }
    return typeof err === 'string' ? err : err.message;
}

module.exports = {
    getError
};