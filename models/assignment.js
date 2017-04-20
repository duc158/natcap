'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const assignmentSchema = new Schema({
  owner: ObjectId,
  student: String,
  name: String,
  comment: String,
  detail: String,
  grade: String
});

// This method will be responsible for task completion.
// TaskSchema.methods.completeTask = function(err) {
// 	if(!err) {
// 		this.isComplete = !(this.isComplete);
// 		this.save();
// 	}
// 	else {
// 		console.log('Error completing a task.');
// 	}
// 	return;
// };

module.exports = mongoose.model('Assignment', assignmentSchema);
