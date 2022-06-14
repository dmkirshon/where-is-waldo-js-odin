import React from "react";

const WinnerNameRequest = ({ winnerName, handleWinnerNameUpdate }) => {
  return (
    <div className="app-winner-name-request">
      <p>Enter the winner name:</p>
      <form className="app-winner-name-request-form">
        <input
          className="app-winner-name-request-input"
          value={winnerName}
          onChange={handleWinnerNameUpdate}
          autoFocus
        ></input>
        <button type="submit" className="app-winner-name-request-submit">
          ➡️
        </button>
      </form>
    </div>
  );
};

export default WinnerNameRequest;
