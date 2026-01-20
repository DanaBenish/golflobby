import { courses } from "../data/courses";
import CourseCard from "../components/CourseCard";

export default function Home() {
  return (
    <div className="macbook-pro">
      <p className="tea-connect">
        <span className="text-wrapper">Tea</span>

        <span className="span">Connect</span>
      </p>

      <div className="div" />

      <div className="text-wrapper-2">Available Golf Courses</div>

      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
