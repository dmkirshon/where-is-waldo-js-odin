import { disableNetwork } from "firebase/firestore";
import React from "react";

const Selector = ({ selectionCoordinates }) => {
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

  return <div>{displayBox()}</div>;
};

export default Selector;
