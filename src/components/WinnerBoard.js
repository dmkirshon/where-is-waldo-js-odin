import React, { useEffect, useState } from "react";
import { getCloudStorageDocData } from "../firebase-sw";

const WinnerBoard = ({ handleResetGame }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getScoresData();
  }, []);

  const getScoresData = async () => {
    const scoresData = await getCloudStorageDocData("scores");

    setScores(scoresData);
  };

  const displayScores = () => {
    return (
      <ul className="app-winner-board-list">
        {scores.map((score) => {
          return (
            <li key={score.name} className="app-winner-board-list-item">
              Name: {score.name} ---{">"} Score: {score.time / 1000} seconds
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="app-winner-board">
      <p className="app-winner-board-title">High Scores</p>
      {displayScores()}
      <button className="app-winner-board-reset" onClick={handleResetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default WinnerBoard;
