import React from "react";
import loadingIcon from "../assets/Rolling-1s-200px.svg"

const Loading: React.FC = () => {
  return (
    <div className="loading-wrapper">
      <img src={loadingIcon} className="loading-icon" />
    </div>
  );
};

export default Loading;
