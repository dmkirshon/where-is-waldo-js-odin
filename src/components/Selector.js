import { disableNetwork } from "firebase/firestore";
import React, { useState } from "react";

const Selector = ({
  narwhalChoices,
  selectionCoordinates,
  handleFoundNarwhal,
}) => {
  const displayBox = () => {
    const styleCoordinates = {
      width: "40px",
      height: "40px",
      left: `${selectionCoordinates.x - 25}px`,
      top: `${selectionCoordinates.y - 25}px`,
    };

    return (
      <div
        style={styleCoordinates}
        className="selector-display-box"
        draggable="false"
      ></div>
    );
  };

  const dropDownChoices = () => {
    const styleCoordinates = {
      left: `${selectionCoordinates.x + 25}px`,
      top: `${selectionCoordinates.y - 25}px`,
    };
    return (
      <div className="narwhal-choices" style={styleCoordinates}>
        {narwhalChoices.map((narwhalChoice) => {
          if (!narwhalChoice.isFound) {
            return (
              <button
                key={narwhalChoice.name}
                className="narwhal-choices-button"
                onClick={handleFoundNarwhal}
              >
                {narwhalChoice.name}
              </button>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div>
      {displayBox()}
      {dropDownChoices()}
    </div>
  );
};

export default Selector;
