const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const Student = require('./student'); // Import the Student model
const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/studentDB')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('MongoDB connection error:', error));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // This serves files in the public directory

app.get('/', async (req, res) => {
    try {
        const students = await Student.find(); // Use plural for clarity
        res.render('index', { students }); // Pass plural variable for clarity
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal server error');
    }
});

// Save student data
app.post('/save', async (req, res) => {
    const { rollNo, name, degree, city } = req.body;

if (!rollNo || !name || !degree || !city) {
    return res.status(400).send("All fields are required");
}
    const student = new Student({ rollNo, name, degree, city });

    try {
        await student.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).send('Internal server error');
    }
});

// Update student data
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { rollNo, name, degree, city } = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { rollNo, name, degree, city },
            { new: true } // Returns the updated document
        );

        if (!updatedStudent) {
            return res.status(404).send('Student not found');
        }

        res.send(updatedStudent); // Send back the updated student
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Internal server error');
    }
});

// Delete student
app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).send("Student not found");
        }

        res.status(200).send("Student deleted successfully");
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).send("Internal server error");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is Running on Port No: ${PORT}`);
});
