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

//This method will be responsible for task toogle.
taskSchema.methods.toogleTask = function(err) {
	if(!err) {
		this.isComplete = !(this.isComplete);
		this.save();
	}
	else {
		console.log('Error completing a task.');
	}
	return;
};

module.exports = mongoose.model('task', taskSchema);
