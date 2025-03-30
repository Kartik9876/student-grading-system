import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../Style.css"
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/students").then((res) => setStudents(res.data));
        axios.get("http://localhost:5000/subjects").then((res) => setSubjects(res.data));
    }, []);

    const calculateAverageMarks = () => {
        const subjectTotals = {};
        const subjectCounts = {};

        students.forEach((student) => {
            Object.entries(student.marks).forEach(([subject, mark]) => {
                if (!subjectTotals[subject]) {
                    subjectTotals[subject] = 0;
                    subjectCounts[subject] = 0;
                }
                subjectTotals[subject] += Number(mark);
                subjectCounts[subject] += 1;
            });
        });

        return Object.keys(subjectTotals).map((subject) => ({
            subject,
            average: subjectTotals[subject] / subjectCounts[subject]
        }));
    };

    const barChartData = {
        labels: calculateAverageMarks().map((data) => data.subject),
        datasets: [
            {
                label: "Average Marks",
                data: calculateAverageMarks().map((data) => data.average),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                borderRadius:5
            },
        ],
    };


    const passFailData = {
        labels: ["Pass", "Fail"],
        datasets: [
            {
                label: "Pass/Fail Ratio",
                data: [
                    students.filter((student) => {
                        const totalMarks = Object.values(student.marks).reduce((acc, mark) => acc + Number(mark), 0);
                        const percentage = subjects.length > 0 ? (totalMarks / (subjects.length * 100)) * 100 : 0;
                        return percentage >= 40;
                    }).length,
                    students.filter((student) => {
                        const totalMarks = Object.values(student.marks).reduce((acc, mark) => acc + Number(mark), 0);
                        const percentage = subjects.length > 0 ? (totalMarks / (subjects.length * 100)) * 100 : 0;
                        return percentage < 40;
                    }).length,
                ],
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button className="btn btn-blue" onClick={() => navigate("/students")}>Back to Students</button>
                <div className="dataCard barChart">
                    <h2>Average Marks Per Subject</h2>
                    <Bar data={barChartData} />
                </div>
                <div className="dataCard pieChart">
                    <h2>Pass/Fail Distribution</h2>
                    <Pie data={passFailData} />
                </div>
            
        </div>
    );
};

export default DashboardPage;