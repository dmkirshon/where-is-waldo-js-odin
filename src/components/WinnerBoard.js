import React, { useEffect, useState } from "react";
import { getCloudStorageDocData } from "../firebase-sw";

const WinnerBoard = ({ handleResetGame }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getScoresData();
  }, []);

  const getScoresData = async () => {
    const scoresData = await getCloudStorageDocData("scores");

    setScores(
      scoresData
        .sort((a, b) => {
          return a.time - b.time;
        })
        .slice(0, 10)
    );
  };

  const displayScores = () => {
    return (
      <ol className="app-winner-board-list">
        {scores.map((score) => {
          return (
            <li
              key={score.name + score.time}
              className="app-winner-board-list-item"
            >
              Name: {score.name} ---{">"} Score: {score.time / 1000} seconds
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div className="app-winner-board">
      <p className="app-winner-board-title">High Scores</p>
      {scores.length === 0 ? (
        <img
          src="https://www.google.com/images/spin-32.gif?a"
          alt="load spinner"
          className="load-spinner"
        ></img>
      ) : (
        <div>
          <button className="app-winner-board-reset" onClick={handleResetGame}>
            Reset Game
          </button>
          {displayScores()}
        </div>
      )}
    </div>
  );
};

export default WinnerBoard;
