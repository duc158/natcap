// load the things we need
var mongoose = require('mongoose');

// define the schema here
var taskSchema = mongoose.Schema({

    owner         : String,
    title					: String,
    description		: String,
    collaborator1	: String,
    collaborator1	: String,
    collaborator1	: String,
    isComplete		: Boolean

});

module.exports = mongoose.model('task', taskSchema);
