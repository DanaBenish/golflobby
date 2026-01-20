import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="course-main-card">
      <div className="course-main-card-text">{course.name}</div>
      <div className="course-main-card-location">{course.location}</div>
      <Link className='course-main-card-link' to={`/course/${course.id}`}>View Tee Times</Link>
    </div>
  );
}

