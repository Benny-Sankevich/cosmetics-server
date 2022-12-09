const mongoose = require('mongoose');

mongoose
    .connect(global.config.mongodb.connectionString)
    .catch((err) => console.log(err));