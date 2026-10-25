import "../css/Question.css";
import { useEffect, useMemo, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import config from "../config.js";
import { usePaper } from "../context/PaperContext.jsx";
import axios from "axios";
import Loader from "../components/Loader.jsx";

export default function Question() {
  const { isLoading, setIsLoading, setHistory, history, showToast } = usePaper();

  const [subject, setSubject] = useState("all");
  const [topic, setTopic] = useState("all");
  const [questionType, setQuestionType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const gethistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/history`);
      setHistory(res.data.questions);
    } catch (error) {
      console.error("Error fetching history:", error);
      showToast(error.response?.data?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = [...new Set(history?.map((q) => q.subject))];

  const topics = [
    ...new Set(
      history
        .filter((q) => subject === "all" || q.subject === subject)
        .map((q) => q.topic),
    ),
  ];

  const questionTypes = [
    ...new Set(history.map((q) => q.type).filter(Boolean)),
  ];

  const filteredhistory = useMemo(() => {
    const now = new Date();

    return history.filter((item) => {
      const questionDate = new Date(item?.createdAt);

      // Subject
      const matchesSubject = subject === "all" || item.subject === subject;

      // Topic
      const matchesTopic = topic === "all" || item.topic === topic;

      // Question Type
      const matchesQuestionType =
        questionType === "all" || item.type === questionType;

      // Date
      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = questionDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "7days") {
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - 7);
        matchesDate = questionDate >= cutoff;
      }

      if (dateFilter === "30days") {
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - 30);
        matchesDate = questionDate >= cutoff;
      }

      return (
        matchesSubject && matchesTopic && matchesQuestionType && matchesDate
      );
    });
  }, [history, subject, topic, questionType, dateFilter]);

  const clearFilters = () => {
    setSubject("all");
    setTopic("all");
    setQuestionType("all");
    setDateFilter("all");
  };

  const hasFilters =
    subject !== "all" ||
    topic !== "all" ||
    questionType !== "all" ||
    dateFilter !== "all";

  useEffect(() => {
    gethistory();
  }, []);

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Question History</h1>
        <p>Your previously generated history</p>

        <span className="question-count">
          Total Questions: {filteredhistory?.length}
        </span>
      </div>

      {/* Filters */}
      <div className="filters">
        {/* Subject */}
        <select
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setTopic("all");
          }}
        >
          <option value="all">All Subjects</option>

          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Topic */}
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">All Topics</option>

          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Question Type */}
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <option value="all">All Question Types</option>

          {questionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Date */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button className="clear-filter" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>
      
      <hr />

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <Loader
            size="medium"
            showLabel={true}
            label="Progressing..."
            color="rgba(170, 59, 255, 0.968)"
          />
        </div>
      ) : (
        <div className="question-list">
          {filteredhistory.length > 0 &&
          filteredhistory.some((item) => item?.questions?.length > 0) ? (
            filteredhistory.map((item, itemIndex) =>
              item?.questions?.map((q, index) => (
                <QuestionCard
                  key={q._id ?? `${itemIndex}-${index}`}
                  question={q}
                  item={item}
                  count={index + 1}
                />
              )),
            )
          ) : (
            <div className="empty-state">
              <h3>No history found</h3>
              <p>Try changing your filters or search term.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
