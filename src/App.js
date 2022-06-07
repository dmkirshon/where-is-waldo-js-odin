import React, { useState, useEffect } from "react";
import "./App.css";

import Selector from "./components/Selector";

import {
  firebaseApp,
  dbFirebaseApp,
  getStorageFirebaseURL,
} from "./firebase-sw";

function App() {
  const [selectionCoordinates, setSelectionCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isSelected, setIsSelected] = useState(false);

  const handleCoordinateUpdateFromSelection = (event) => {
    const imageCoordinates = event.target.getBoundingClientRect();
    const imageX = imageCoordinates.x;
    const imageY = imageCoordinates.y;

    const xCoordinateSelection = event.clientX;
    const yCoordinateSelection = event.clientY;

    setIsSelected((wasSelected) => !wasSelected);
    setSelectionCoordinates({
      x: xCoordinateSelection,
      y: yCoordinateSelection,
    });
  };

  // Image from Where's the Narwhal? A Search and Find Book by Hachette Children's Group (Author), Dynamo (Illustrator)
  // https://www.amazon.com.au/Wheres-Narwhal-Search-Find-Book/dp/1408359464/ref=zg_bs_4901994051_17/355-1144435-3690642?pd_rd_i=1408359464&psc=1
  useEffect(() => {
    const loadFindNarwhalImage = async () => {
      const narwhalImageURL = await getStorageFirebaseURL(
        "gs://where-s-waldo-51850.appspot.com/images/wheres-narwhal.jpg"
      );

      const appMainImage = document.querySelector(".app-main-image");
      appMainImage.setAttribute("src", narwhalImageURL);
    };

    loadFindNarwhalImage().catch(console.error);
  }, []);

  return (
    <div className="App">
      <button>Start</button>
      <img
        className="app-main-image"
        src="https://www.google.com/images/spin-32.gif?a"
        alt="A beach scene with a hidden narwhal"
        onClick={handleCoordinateUpdateFromSelection}
        draggable="false"
      />
      {isSelected && <Selector selectionCoordinates={selectionCoordinates} />}
    </div>
  );
}

export default App;
