import "../css/Create.css";
import GenQuesForm from "../components/GenQuesForm.jsx";
import PreviewSection from "../components/PreviewSection.jsx";
import PaperLayout from "../components/PaperLayout.jsx";

export default function Generate() {
  return (
      <div className="gen-container">
        <div className="create-header">
          <h1>Create new paper</h1>
          <p>Define subject, mix and question types</p>
        </div>
        <div className="hero-section">
          <GenQuesForm />
          <PreviewSection />
        </div>
        <PaperLayout />
      </div>
  );
}
