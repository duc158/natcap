'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const stringField = {
  type: String,
  minlength: 1,
  maxlength: 500,
};

const taskSchema = new Schema({
  owner: ObjectId,
  name: stringField,
  description: stringField,
  isComplete: Boolean,
  collaborator1: stringField,
  collaborator2: stringField,
  collaborator3: stringField
});

//This method will be responsible for task completion.
taskSchema.methods.completeTask = function(err) {
	if(!err) {
		this.isComplete = !(this.isComplete);
		this.save();
	}
	else {
		console.log('Error completing a task.');
	}
	return;
};

module.exports = mongoose.model('Tasks', taskSchema);
