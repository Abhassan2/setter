import { Routes, Route } from "react-router-dom";
import Generate from "./pages/Generate.jsx";
import Paper from "./pages/Paper.jsx";
import Question from "./pages/Question.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
  return (
    <div className="app">
      <div className="app-sidebar">
        <Sidebar />
      </div>

      <main className="app-layout">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Generate />} />
            <Route path="/paper" element={<Paper />} />
            <Route path="/question" element={<Question />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
