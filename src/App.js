import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubjectsPage from "./component/SubjectsPage";
import StudentsPage from "./component/StudentsPage";
import DashboardPage from "./component/DashboardPage";
import "./Style.css";

const App = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubjectsPage subjects={subjects} setSubjects={setSubjects} />} />
        <Route path="/students" element={<StudentsPage subjects={subjects} students={students} setStudents={setStudents} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
