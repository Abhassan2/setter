import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, FileText, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { usePaper } from "../context/PaperContext.jsx";
import config from "../config.js";
import "../css/Paper.css";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[-_.,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// "oct" / "sept" -> "october" / "september"
const toMonth = (word) =>
  word.length >= 3 ? MONTHS.find((m) => m.startsWith(word)) || word : word;

export default function Paper() {
  const { showToast, isLoading, setIsLoading } = usePaper();
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/documents`);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch documents");
      }

      setFiles(res.data.files || []);
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Unable to load documents",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    const words = normalize(search).split(" ").filter(Boolean);
    if (words.length === 0) return files;

    return files.filter((file) => {
      const name = normalize(file.name);
      const nameWithFullMonths = name.split(" ").map(toMonth).join(" ");

      return words.every(
        (word) =>
          name.includes(word) || nameWithFullMonths.includes(toMonth(word)),
      );
    });
  }, [files, search]);

  return (
    <div className="docs-page">
      <main className="docs-container">
        <header className="docs-header">
          <div>
            <h1>Documents</h1>
            <p>
              {isLoading
                ? "Loading…"
                : `${filteredFiles.length} of ${files.length} files`}
            </p>
          </div>
        </header>

        <label className="search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => handleSearch(e)}
          />
        </label>

        <section className="docs-card">
          {isLoading ? (
            <ul className="docs-list">
              {[1, 2, 3, 4, 5].map((n) => (
                <li className="skeleton-row" key={n} />
              ))}
            </ul>
          ) : filteredFiles.length === 0 ? (
            <div className="empty">
              <p>No documents found.</p>
            </div>
          ) : (
            <ul className="docs-list">
              {filteredFiles.map((file) => {
                return (
                  <li className="doc-row" key={file._id}>
                    <button
                      className="doc-main"
                      onClick={() => navigate(`/documents/${file._id}`)}
                    >
                      <span className={`doc-icon`}>{<FileText />}</span>
                      <span className="doc-text">
                        <span className="doc-name" title={file.name}>
                          {file.name}
                        </span>
                        <span className="doc-meta">
                          {file.createdAt &&
                            ` · ${new Date(file.createdAt).toLocaleDateString()}`}
                        </span>
                      </span>
                      <span className="doc-badge">{file.format || "file"}</span>
                    </button>

                    <a
                      className="icon-button"
                      href={file.url}
                      target="_blank"
                      // rel="noreferrer"
                      aria-label={`Open ${file.name}`}
                      title="Open"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
