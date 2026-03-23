import React from "react";
import "./spinner.scss";

interface SpinnerProps {
  open: boolean;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ open, message = "Processing..." }) => {
  if (!open) return null;

  return (
    <div className="loader-backdrop">
      <div className="loader-content">
      
        <div className="loader-spinner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="64px"
            viewBox="0 -960 960 960"
            width="64px"
            fill="currentColor"
          >
            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
          </svg>
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;
