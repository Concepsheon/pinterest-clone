var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Image = new Schema({
    image: String,
    added_by: String
});

module.exports = mongoose.model("Image", Image);