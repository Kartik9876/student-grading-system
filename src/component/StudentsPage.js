import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style.css";
import * as XLSX from 'xlsx';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [marks, setMarks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/students").then((res) => setStudents(res.data));
    axios.get("http://localhost:5000/subjects").then((res) => setSubjects(res.data));
  }, []);

  const addOrUpdateStudent = async () => {
    if (studentName.trim() && rollNo.trim()) {
      const existingStudent = students.find(student => student.rollNo === rollNo);
      const updatedStudent = { rollNo, studentName, marks };
      
      try {
        if (existingStudent) {
          await axios.put(`http://localhost:5000/students/${rollNo}`, updatedStudent);
        } else {
          await axios.post("http://localhost:5000/students", updatedStudent);
        }
  
        // Fetch updated students list after modifying data
        const res = await axios.get("http://localhost:5000/students");
        setStudents(res.data);
  
        setStudentName("");
        setRollNo("");
        setMarks({});
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const downloadExcel = () => {
    if (students.length === 0) return;

    // Get all unique subjects from student data
    const allSubjects = new Set();
    students.forEach(student => {
      Object.keys(student.marks).forEach(subject => allSubjects.add(subject));
    });
  
    // Sort subjects alphabetically
    const sortedSubjects = [...allSubjects].sort();

    // Sort students by roll number (ascending)
    const sortedStudents = [...students].sort((a, b) => a.rollNo - b.rollNo);

  
    // Prepare data for Excel
    const data = sortedStudents.map(student => {
      const row = {
        "Roll No": student.rollNo,
        "Name": student.studentName,
      };
  
      // Maintain subject order
      sortedSubjects.forEach(subject => {
        row[subject] = student.marks[subject] || "N/A"; // Show "N/A" if no marks
      });
  
      row["Percentage"] = calculatePercentage(student.marks).toFixed(2) + "%";
      row["Grade"] = getGrade(calculatePercentage(student.marks));
  
      return row;
    });
  
    // Convert data to Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students Data");
  
    // Download Excel file
    XLSX.writeFile(workbook, "Student_Grades.xlsx");
  };
  
  const deleteStudent = async (rollNo) => {
    try {
      await axios.delete(`http://localhost:5000/students/${rollNo}`);
      setStudents(students.filter((student) => student.rollNo !== rollNo));
    } catch (err) {
      console.error(err);
    }
  };

  const calculatePercentage = (marks) => {
    const subjectCount = Object.keys(marks).length; // Count only subjects student has marks for
    if (subjectCount === 0) return 0;
  
    const totalMarks = Object.values(marks).reduce((acc, mark) => acc + Number(mark), 0);
    return (totalMarks / (subjectCount * 100)) * 100;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "O";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 40) return "E";
    return "F";
  };

  return (
    <div className="students-container">
      <div className="form-box">
        <h2 className="form-title">Add Student</h2>
        <div className="form-content">
          <input
            type="text"
            placeholder="Enter student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter roll number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="input-field"
          />
          {subjects.map((subject) => (
            <input
              key={subject.name}
              type="number"
              placeholder={`Enter marks for ${subject.name}`}
              value={marks[subject.name] || ""}
              onChange={(e) => setMarks({ ...marks, [subject.name]: e.target.value })}
              className="input-field"
            />
          ))}
      <button onClick={addOrUpdateStudent} className="btn btn-blue">
              Add/Update Student 
      </button>
      <button onClick={() => navigate("/subjects")} className="btn btn-green">
          <i className="fa fa-arrow-left"></i> Go to Subjects
      </button>
      <button onClick={downloadExcel} className="btn btn-blue">
          Download Excel <i className="fa fa-download"></i>
      </button>
      <button onClick={() => navigate("/dashboard")} className="btn btn-purple">
          Analysis Dashboard <i className="fa fa-bar-chart"></i>
      </button>

        </div>
      </div>
      <div className="students-list-box">
        <h1 className="title">Students</h1>
        <div className="students-grid">
          {students.map((student) => {
            const percentage = calculatePercentage(student.marks);
            const grade = getGrade(percentage);
            const status = percentage >= 40 ? "Pass" : "Fail";

            return (
              <div key={student.rollNo} className="student-item">
                <button className="delete-btn" onClick={() => deleteStudent(student.rollNo)}>
                  <i className="fas fa-trash"></i>
                </button>
                <strong>{student.studentName} (Roll No: {student.rollNo})</strong>
                <ul>
                  {Object.entries(student.marks).map(([subject, mark]) => (
                    <li key={subject}>{subject}: {mark}</li>
                  ))}
                </ul>
                <p>Percentage: {percentage.toFixed(2)}%</p>
                <p>Grade: {grade}</p>
                <p className={status === "Pass" ? "pass-text" : "fail-text"}>{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;