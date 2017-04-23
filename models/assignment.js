'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const assignmentSchema = new Schema({
  owner: ObjectId,
  student: String,
  name: String,
  comment: String,
  commentGrader: String,
  detail: String,
  date: String,
  grade: String
});

module.exports = mongoose.model('Assignment', assignmentSchema);
