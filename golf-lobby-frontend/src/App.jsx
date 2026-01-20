import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CourseDetails from "./pages/CourseDetails";
import Lobby from "./pages/Lobby";
import ScrollToTop from './components/ScrollTop';


function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/lobby/:id" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

