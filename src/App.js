import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubjectsPage from "./component/SubjectsPage";
import StudentsPage from "./component/StudentsPage";
import DashboardPage from "./component/DashboardPage";
import TopBar from "./component/TopBar"; // Importing TopBar
import "./Style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  return (
    <Router>
      <TopBar />  {/* Top Bar is outside Routes to always stay visible */}
      <div className="main-container"> {/* Added a wrapper to push content down */}
        <Routes>
          <Route path="/" element={<SubjectsPage subjects={subjects} setSubjects={setSubjects} />} />
          <Route path="/students" element={<StudentsPage subjects={subjects} students={students} setStudents={setStudents} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
