import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/subjects").then((res) => setSubjects(res.data));
  }, []);

  const addSubject = async () => {
    if (subjectName.trim()) {
      try {
        const res = await axios.post("http://localhost:5000/subjects", { name: subjectName });
        setSubjects([...subjects, res.data]);
        setSubjectName("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteSubject = async (subjectName) => {
    try {
      await axios.delete(`http://localhost:5000/subjects/${subjectName}`);
      setSubjects(subjects.filter(subject => subject.name !== subjectName));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="subjects-container">
      <div className="form-box">
        <h2 className="form-title">Add Subject</h2>
        <div className="form-content">
          <input
            type="text"
            placeholder="Enter subject name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="input-field"
          />
          <button onClick={addSubject} className="btn btn-blue">Add Subject</button>
          <button onClick={() => navigate("/")} className="btn btn-green">
            Go to Students
            <i className="fa fa-arrow-right" ></i>
          </button>
        </div>
      </div>
      <div className="subjects-list-box">
        <h1 className="title">Subjects</h1>
        <ul className="subjects-list">
          {subjects.map((subject) => (
            <li key={subject._id} className="subject-item">
              <span>{subject.name}</span>
              <button className="delete-btn" onClick={() => deleteSubject(subject.name)}>
                  <i className="fas fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubjectsPage;