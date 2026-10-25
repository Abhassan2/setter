import React, { useEffect, useState } from "react";

const sizes = {
  small: 20,
  medium: 36,
  large: 56,
};

function Loader({
  isLoading = false,
  size = "medium",
  color = "#3b82f6",
  thickness,
  fullScreen = false,
  label = "Loading...",
  waitMessage = "This may take some time. Please stay here...",
  interval = 5000,
  showLabel = false,
  className = "",
}) {
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowWaitMessage(false);
      return;
    }

    setShowWaitMessage(false);

    const timer = setInterval(() => {
      setShowWaitMessage((prev) => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, interval]);

  if (!isLoading) return null;

  const dimension =
    typeof size === "number" ? size : (sizes[size] ?? sizes.medium);

  const borderWidth = thickness ?? Math.max(2, Math.round(dimension / 10));

  const currentLabel = showWaitMessage ? waitMessage : label;

  return (
    <div
      className={`loader-wrapper ${
        fullScreen ? "loader-fullscreen" : ""
      } ${className}`}
      role="status"
      aria-label={currentLabel}
    >
      <span
        className="loader-spinner"
        aria-hidden="true"
        style={{
          width: dimension,
          height: dimension,
          borderWidth,
          borderTopColor: color,
        }}
      />

      {showLabel && <span className="loader-label">{currentLabel}</span>}
    </div>
  );
}

export default React.memo(Loader);
