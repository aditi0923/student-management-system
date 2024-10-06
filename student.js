const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    degree: String,
    city: String,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
