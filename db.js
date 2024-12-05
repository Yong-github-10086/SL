const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'sh@621821',
    database: 'StudentManagement' // replace with your actual database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + db.threadId);
});

// Function to add a student
db.addStudent = function(studentInfo) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO students (firstName, lastName, birthday, sex, phone, address, distance, city, postalCode, school, programInterest,
            emergencyFirstName, emergencyLastName, emergencyPhone, relationship, emergencyAddress, emergencyCity, emergencyPostalCode,
            parent1FirstName, parent1LastName, parent1Phone, parent1Email, parent1Address, parent1City, parent1Employer,
            parent2FirstName, parent2LastName, parent2Phone, parent2Email, parent2Address, parent2City, parent2Employer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            studentInfo.firstName,
            studentInfo.lastName,
            studentInfo.birthday,
            studentInfo.sex,
            studentInfo.phone,
            studentInfo.address,
            studentInfo.distance,
            studentInfo.city,
            studentInfo.postalCode,
            studentInfo.school,
            studentInfo.programInterest,
            studentInfo.emergencyFirstName,
            studentInfo.emergencyLastName,
            studentInfo.emergencyPhone,
            studentInfo.relationship,
            studentInfo.emergencyAddress,
            studentInfo.emergencyCity,
            studentInfo.emergencyPostalCode,
            studentInfo.parent1FirstName,
            studentInfo.parent1LastName,
            studentInfo.parent1Phone,
            studentInfo.parent1Email,
            studentInfo.parent1Address,
            studentInfo.parent1City,
            studentInfo.parent1Employer,
            studentInfo.parent2FirstName,
            studentInfo.parent2LastName,
            studentInfo.parent2Phone,
            studentInfo.parent2Email,
            studentInfo.parent2Address,
            studentInfo.parent2City,
            studentInfo.parent2Employer
        ];

        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

async function getAllStudents() {
    const [results] = await connection.execute('SELECT id, firstName, lastName, phone FROM students');
    return results;
}

// Function to get a student by ID
db.getStudentById = function(studentId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM students WHERE id = ?`;

        db.query(query, [studentId], (err, results) => {
            if (err) {
                return reject(err);
            }
            // Resolve with the first result (should only be one since ID is unique)
            resolve(results[0]);
        });
    });
};


db.updateStudent = function(updatedStudentInfo) {
    return new Promise((resolve, reject) => {
        console.log('Checking updatedStudentInfo:', updatedStudentInfo);
        // Check for undefined values
        const missingFields = Object.keys(updatedStudentInfo).filter(key => updatedStudentInfo[key] === undefined);
        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            // Optionally, you could return an error if required fields are undefined.
            return reject(new Error(`Missing fields: ${missingFields.join(', ')}`));
        }
        
        

        const query = `
            UPDATE students SET
                firstName = ?, lastName = ?, birthday = ?, sex = ?, phone = ?, address = ?, city = ?, postalCode = ?, 
                school = ?, programInterest = ?, emergencyFirstName = ?, emergencyLastName = ?, emergencyPhone = ?, 
                emergencyAddress = ?, emergencyCity = ?, emergencyPostalCode = ?, relationship = ?, 
                parent1FirstName = ?, parent1LastName = ?, parent1Phone = ?, parent1Address = ?, parent1City = ?, 
                parent1Email = ?, parent1Employer = ?, parent2FirstName = ?, parent2LastName = ?, parent2Phone = ?, parent2Address = ?, parent2City = ?, 
                parent2Email = ?, parent2Employer = ?
            WHERE id = ?`;

        const values = [
            updatedStudentInfo.firstName,
            updatedStudentInfo.lastName,
            updatedStudentInfo.birthday,
            updatedStudentInfo.sex,
            updatedStudentInfo.phone,
            updatedStudentInfo.address,
            updatedStudentInfo.city,
            updatedStudentInfo.postalCode,
            updatedStudentInfo.school,
            updatedStudentInfo.programInterest,
            updatedStudentInfo.emergencyFirstName,
            updatedStudentInfo.emergencyLastName,
            updatedStudentInfo.emergencyPhone,
            updatedStudentInfo.emergencyAddress,
            updatedStudentInfo.emergencyCity,
            updatedStudentInfo.emergencyPostalCode,
            updatedStudentInfo.relationship,
            updatedStudentInfo.parent1FirstName,
            updatedStudentInfo.parent1LastName,
            updatedStudentInfo.parent1Phone,
            updatedStudentInfo.parent1Address,
            updatedStudentInfo.parent1City,
            updatedStudentInfo.parent1Email,
            updatedStudentInfo.parent1Employer,
            updatedStudentInfo.parent2FirstName,
            updatedStudentInfo.parent2LastName,
            updatedStudentInfo.parent2Phone,
            updatedStudentInfo.parent2Address,
            updatedStudentInfo.parent2City,
            updatedStudentInfo.parent2Email,
            updatedStudentInfo.parent2Employer,
            updatedStudentInfo.studentId // Ensure the ID is at the end for the WHERE clause
        ];

        

        db.execute(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

db.enrollStudent = function(studentId, year, semester) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO enrollments (studentId, year, semester) VALUES (?, ?, ?)`;
        const values = [studentId, year, semester];

        db.execute(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};



module.exports = db;
