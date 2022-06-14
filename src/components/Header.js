import React, { useEffect, useState } from "react";

const Header = ({ gameWon, currentTimerTime }) => {
  const [time, setTime] = useState("00:00");

  const formatTimer = (time) => {
    const seconds = (time % 60).toFixed(0).padStart(2, "0");
    const minutes = ((time - seconds) / 60).toFixed(0).padStart(2, "0");
    const formatMinutesIfNegative = minutes < 1 ? "00" : minutes;

    return `${formatMinutesIfNegative}:${seconds}`;
  };

  // Instantiate an interval clock to update the game time, clean up if game won
  useEffect(() => {
    let timeInterval = null;

    if (!gameWon) {
      timeInterval = setInterval(
        () => setTime(formatTimer(currentTimerTime() / 1000)),
        1000
      );
    }

    return () => clearInterval(timeInterval);
  }, [currentTimerTime, gameWon]);

  // Update timer on header with current game time
  useEffect(() => {
    const gameInfoTimer = document.querySelector(".game-info-timer");
    gameInfoTimer.textContent = `Timer: ${time}`;
  }, [time]);

  return (
    <header className="app-header">
      <h1 className="app-header-title">Find the Narwhals</h1>
      <section className="app-header-game-info">
        <p className="game-info-narwhals-remaining">Narwhal's left</p>
        <p className="game-info-timer">Timer</p>
      </section>
    </header>
  );
};

export default Header;
