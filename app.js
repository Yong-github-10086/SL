const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const db = require('./db'); // Import your db module

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files (for Bootstrap, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/add', (req, res) => {
    res.render('add', { message: null, error: null });
});

app.post('/add', async (req, res) => {
    const studentInfo = req.body; // Get form data

    try {
        await db.addStudent(studentInfo); // Save the data to the database
        res.render('add', { message: 'Info added successfully!', error: null });
    } catch (error) {
        console.error(error);
        res.render('add', { message: null, error: 'Info added failed!' });
    }
});

app.get('/get-students', async (req, res) => {
    try {
        const students = await db.promise().query('SELECT id, firstName, lastName, phone FROM students');
        console.log(students);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

app.get('/enroll', (req, res) => {
    res.render('enroll', { message: null, error: null });
});

app.post('/enroll', (req, res) => {
    const { studentId, year, semester } = req.body;

    if (!studentId || !year || !semester) {
        return res.render('enroll', { message: null, error: 'All fields are required.' });
    }

    // Assuming db.enrollStudent is a function that handles database enrollment logic
    db.enrollStudent(studentId, year, semester)
        .then(() => {
            res.render('enroll', { message: 'Enrollment successful!', error: null });
        })
        .catch(err => {
            console.error('Enrollment error:', err);
            res.render('enroll', { message: null, error: 'Enrollment failed. Please try again.' });
        });
});

app.get('/edit', (req, res) => {
    res.render('edit', { message: null, error: null });
});

app.post('/edit', async (req, res) => {
    const updatedStudentInfo = req.body; // Get updated form data
    console.log('updatedStudentInfo' , updatedStudentInfo);
    // Check for missing fields
    const requiredFields = [ 'studentId', 'firstName', 'lastName', 'birthday', 'sex', 'phone', 
    'address', 'city', 'postalCode', 'school', 'programInterest',
    'emergencyFirstName', 'emergencyLastName', 'emergencyPhone',
    'emergencyAddress', 'emergencyCity', 'emergencyPostalCode',
    'relationship', 'parent1FirstName', 'parent1LastName', 
    'parent1Phone', 'parent1Address', 'parent1City', 
    'parent1Email', 'parent1Employer', 
    'parent2FirstName', 'parent2LastName', 'parent2Phone', 
    'parent2Address', 'parent2City', 'parent2Email', 'parent2Employer'
 ];
    const missingFields = requiredFields.filter(field => updatedStudentInfo[field] === undefined);
    if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return res.render('edit', { message: null, error: `Missing fields: ${missingFields.join(', ')}` });
    }
    // Here you would typically add logic to update the student info in your database
    // For demonstration, let's assume it always succeeds
    try {
        await db.updateStudent(updatedStudentInfo); // Update the student info in the database
        res.render('edit', { message: 'Info updated successfully!', error: null });
    } catch (error) {
        console.error(error);
        res.render('edit', { message: null, error: 'Failed to update info.' });
    }

    
});

app.get('/get-student-info', async (req, res) => {
    const studentId = req.query.id; // Get the student ID from the query string

    try {
        const student = await db.getStudentById(studentId); // Fetch the student info by ID
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to confirm the date and get the students for that semester
app.post('/attendance', (req, res) => {
    const { year, month, day, semester } = req.body;

    // Mock query: Replace with your actual database query to get students based on year and semester
    const students = [
        { id: 1, firstName: 'John', lastName: 'Doe', phone: '123-456-7890', enrolledYear: year, semester: 'Fall' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', phone: '987-654-3210', enrolledYear: year, semester: 'Spring' }
    ];

    // Filter students based on the selected year and semester
    const filteredStudents = students.filter(student => student.enrolledYear == year && student.semester == semester);

    // Render the attendance page again, now with filtered students
    res.render('attendance', { students: filteredStudents, year, month, day, semester, message: null, error: null });
});


app.post('/take-attendance', (req, res) => {
    const { studentId, year, month, day } = req.body;

    // Dummy logic to simulate attendance taking
    const success = Math.random() < 0.5; // Simulate success/failure randomly

    if (success) {
        res.render('attendance', { students: null, message: 'Attendance taken successfully!', error: null });
    } else {
        res.render('attendance', { students: null, message: null, error: 'Attendance failed. Please try again.' });
    }
});

const students = [
    { id: 1, firstName: 'John', lastName: 'Doe', phone: '123-456-7890' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', phone: '987-654-3210' }
];

app.get('/attendance', (req, res) => {
    res.render('attendance', { students: null, year: null, month: null, day: null, semester: null, message: null, error: null });
});

// GET request to render the track page
app.get('/track', (req, res) => {
    res.render('track', { students: null, selectedStudent: null, attendanceData: null, year: null, semester: null, month: null, day: null });
});

const attendanceRecords = [
    { studentId: 1, month: 'January', year: 2024, status: 'Attended' },
    { studentId: 2, month: 'January', year: 2024, status: 'Not Attended' },
];

// POST request to handle the form submission for tracking
app.post('/track', (req, res) => {
    const { trackOption, year, semester, studentId, month } = req.body;

    if (trackOption === 'trackStudent') {
        // Mock student data (replace with your actual database query)
        const students = [
            { id: 1, firstName: 'John', lastName: 'Doe', phone: '123-456-7890', enrolledYear: year, semester: semester },
            { id: 2, firstName: 'Jane', lastName: 'Smith', phone: '987-654-3210', enrolledYear: year, semester: semester }
        ];

        // Find the selected student
        const selectedStudent = students.find(student => student.id == studentId);

        // Get attendance data for the selected student for the specified month and year
        const attendanceData = attendanceRecords.filter(record => 
            record.studentId == studentId && record.month === month && record.year == year
        );

        res.render('track', {
            students: null, 
            selectedStudent, 
            attendanceData, 
            year, 
            semester, 
            month
        });

    } else if (trackOption === 'trackAll') {
        // Logic for tracking all students' attendance for a specific day of a month (implement as needed)
        const attendanceData = attendanceRecords.filter(record => 
            record.month === month && record.year == year
        );

        res.render('track', { students: null, selectedStudent: null, attendanceData, year, semester, month });
    }
});

// // Route to get students enrolled in a specific year and semester
// app.get('/get-students', async (req, res) => {
//     const { year, semester } = req.query;

//     try {
//         const students = await getStudentsByYearAndSemester(year, semester);
//         res.json(students);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to get information for a specific student
// app.get('/get-student-info', async (req, res) => {
//     const { id } = req.query;

//     try {
//         const studentInfo = await getStudentInfo(id);
//         res.json(studentInfo);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route to get attendance for an individual student for a specific month
app.get('/get-attendance', async (req, res) => {
    const { studentId, month } = req.query;

    try {
        const attendanceRecords = await getAttendanceForStudent(studentId, month);
        res.json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to get all students' attendance for a specific day in a specific month
app.get('/get-all-attendance', async (req, res) => {
    const { year, semester, date } = req.query;

    try {
        const attendanceRecords = await getAllAttendanceForSemester(year, semester, date);
        res.json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Example function implementations (replace with your actual database logic)
async function getStudentsByYearAndSemester(year, semester) {
    // Replace with your logic to fetch students from the database
    return [
        { id: 1, firstName: 'John', lastName: 'Doe', phone: '123-456-7890' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', phone: '098-765-4321' },
    ];
}

async function getStudentInfo(id) {
    // Replace with your logic to fetch student info from the database
    return { firstName: 'John', lastName: 'Doe', phone: '123-456-7890' };
}

async function getAttendanceForStudent(studentId, month) {
    // Replace with your logic to fetch attendance records for a student for a specific month
    return [
        { date: '2024-01-01', status: 'Attended' },
        { date: '2024-01-02', status: 'Not Attended' },
    ];
}

async function getAllAttendanceForSemester(year, semester, date) {
    // Replace with your logic to fetch attendance for all students for a specific day
    return [
        { name: 'John Doe', phone: '123-456-7890', attended: true },
        { name: 'Jane Smith', phone: '098-765-4321', attended: false },
    ];
}


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});