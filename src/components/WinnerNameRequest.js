import React from "react";

const WinnerNameRequest = ({
  winnerName,
  handleWinnerNameUpdate,
  submitWinnerDataToStorage,
}) => {
  const loadSpinnerWhileNameProcessed = () => {
    const winnerRequest = document.querySelector(".app-winner-name-request");
    const loadImage = document.createElement("img");
    loadImage.src = "https://www.google.com/images/spin-32.gif?a";
    loadImage.className = "load-spinner";
    winnerRequest.replaceChildren(loadImage);
  };

  return (
    <div className="app-winner-name-request">
      <p>Enter the winner name:</p>
      <form
        className="app-winner-name-request-form"
        onSubmit={(event) => {
          event.preventDefault();
          loadSpinnerWhileNameProcessed();
          submitWinnerDataToStorage();
        }}
      >
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
