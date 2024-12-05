-- Create a database for the student management system
drop database if exists StudentManagement; 

CREATE DATABASE StudentManagement;

USE StudentManagement;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    sex ENUM('Male', 'Female', 'Other') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    distance VARCHAR(50), 
    city VARCHAR(100) NOT NULL,
    postalCode VARCHAR(20) NOT NULL,
    school VARCHAR(255) NOT NULL,
    programInterest VARCHAR(255) NOT NULL,
    
    emergencyFirstName VARCHAR(255) NOT NULL,
    emergencyLastName VARCHAR(255) NOT NULL,
    emergencyPhone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    emergencyAddress VARCHAR(255) NOT NULL,
    emergencyCity VARCHAR(100) NOT NULL,
    emergencyPostalCode VARCHAR(20) NOT NULL,

    parent1FirstName VARCHAR(255) NOT NULL,
    parent1LastName VARCHAR(255) NOT NULL,
    parent1Phone VARCHAR(20) NOT NULL,
    parent1Email VARCHAR(255) NOT NULL,
    parent1Address VARCHAR(255) NOT NULL,
    parent1City VARCHAR(100) NOT NULL,
    parent1Employer VARCHAR(255) NOT NULL,

    parent2FirstName VARCHAR(255) NOT NULL,
    parent2LastName VARCHAR(255) NOT NULL,
    parent2Phone VARCHAR(20) NOT NULL,
    parent2Email VARCHAR(255) NOT NULL,
    parent2Address VARCHAR(255) NOT NULL,
    parent2City VARCHAR(100) NOT NULL,
    parent2Employer VARCHAR(255) NOT NULL
);


-- Table to store enrollment information
CREATE TABLE Enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    year YEAR,
    semester ENUM('Fall', 'Spring', 'Summer'),
    FOREIGN KEY (studentId) REFERENCES Students(id)
);

-- Table to store attendance records
CREATE TABLE Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    date DATE,
    status ENUM('Attended', 'Not Attended'),
    FOREIGN KEY (studentId) REFERENCES Students(id)
);



