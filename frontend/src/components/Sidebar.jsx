import "../css/Sidebar.css";
import { NavLink } from "react-router-dom";
import { House, FileText, CircleHelp } from "lucide-react";
import { usePaper } from "../context/PaperContext.jsx";

export default function Sidebar() {
  const { toggleTheme, isDark } = usePaper();
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h1>
          Setter <sup>Ai-Based</sup>
        </h1>
        <img
          src={
            isDark
              ? "https://tse2.mm.bing.net/th/id/OIP.PFeR4ROnqFcdpD94V5VKoAHaHa?r=0&pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3"
              : "https://www.bing.com/th/id/OIP.lvxRCVzV9gXPycq-qp2xkwHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2"
          }
          alt="Toggle theme"
          title="Toggle theme"
          onClick={toggleTheme}
        />
        <p>Paper generater</p>
      </div>

      <div className="sidebar-links .sidebar-menu ">
        <NavLink to="/" className="sidebar-link">
          <House size={20} />
          <span>Generate</span>
        </NavLink>
        <NavLink to="/question" className="sidebar-link">
          <FileText size={20} />
          <span>Question</span>
        </NavLink>
        <NavLink to="/paper" className="sidebar-link">
          <CircleHelp size={20} />
          <span>Paper</span>
        </NavLink>
      </div>

      {/* <div className="theme-action sidebar-link">
        <span>Mode:</span>
        <img
          src="https://www.bing.com/th/id/OIP.lvxRCVzV9gXPycq-qp2xkwHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2"
          alt="moon icon"
        />
      </div> */}
    </div>
  );
}
