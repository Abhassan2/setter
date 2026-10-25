import "../css/Sidebar.css";
import { NavLink } from "react-router-dom";
import { House, FileText, CircleHelp } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h1>Setter <sup>Ai-Based</sup></h1>
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
    </div>
  );
}
