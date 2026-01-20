import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses } from "../data/courses";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teeTimesStatus, setTeeTimesStatus] = useState({});

  const course = courses.find(c => c.id === parseInt(id));

  const fetchStatuses = async () => {
    const statuses = {};
    for (const time of course.teeTimes) {
      try {
        const response = await fetch(`http://localhost:3003/tee-time?course_id=${id}&time=${encodeURIComponent(time)}`);
        if (response.ok) {
          const data = await response.json();
          statuses[time] = data;
        } else {
          console.error("Bad response for", time, response.status);
        }
      } catch (error) {
        console.error("Error fetching status for", time, error);
      }
    }
    setTeeTimesStatus(statuses);
  };

  useEffect(() => {
    if (course) {
      const initialStatuses = {};
      course.teeTimes.forEach(time => {
        initialStatuses[time] = { is_full: false };
      });
      setTeeTimesStatus(initialStatuses);
      fetchStatuses();
    }
  }, [id, course]);

  return (
    <div className="macbook-pro">
      <h1 className="text-wrapper">{course.name}</h1>
      <p className="text-wrapper">{course.description}</p>

      <h3 className="text-wrapper">Select Tee Time (12.18)</h3>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        }}>
        {course.teeTimes.map(time => {
          const status = teeTimesStatus[time];
          const isFull = status?.is_full;
          return (
            <button
              key={time}
              onClick={() => !isFull && navigate(`/lobby/${id}`, { state: { time } })}
              disabled={isFull}
              style={{ opacity: isFull ? 0.5 : 1 }}
            >
              {time} {isFull ? "(Full)" : ""}
            </button>
          );
        })}
        </div>
    </div>
  );
}
