import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Selector from "./components/Selector";

import { getStorageFirebaseURL, getCloudStorageDocData } from "./firebase-sw";

function App() {
  const [narwhalChoices, setNarwhalChoices] = useState([
    { name: "Noah", isFound: false, coordinates: { x: 75, y: 160 } },
    { name: "Niall", isFound: false, coordinates: { x: 75, y: 190 } },
    { name: "Nicola", isFound: false, coordinates: { x: 85, y: 230 } },
    { name: "Nigel", isFound: false, coordinates: { x: 80, y: 265 } },
    { name: "Natalie", isFound: false, coordinates: { x: 80, y: 295 } },
    { name: "Nancy", isFound: false, coordinates: { x: 80, y: 320 } },
  ]);

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
  // https://www.amazon.com/Wheres-Narwhal-Search-Find-Book/dp/1408359464/ref=zg_bs_4901994051_17/355-1144435-3690642?pd_rd_i=1408359464&psc=1
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

  const isMouseNearCoordinates = (
    mouseX,
    mouseY,
    coordinateX,
    coordinateY,
    toleranceFactor = 15
  ) => {
    if (
      mouseX > coordinateX - toleranceFactor &&
      mouseX < coordinateX + toleranceFactor &&
      mouseY > coordinateY - toleranceFactor &&
      mouseY < coordinateY + toleranceFactor
    ) {
      return true;
    }
    return false;
  };

  const handleNarwhalLegendNames = (event) => {
    // relative coordinate system for image and mouse over
    const imagePosition = event.target.getBoundingClientRect();
    const mouseOverAdjX = event.clientX - imagePosition.left;
    const mouseOverAdjY = event.clientY - imagePosition.top;

    // if around narwhal reference coordinates
    const onNarwhalLegend = narwhalChoices.filter((narwhalChoice) =>
      isMouseNearCoordinates(
        mouseOverAdjX,
        mouseOverAdjY,
        narwhalChoice.coordinates.x,
        narwhalChoice.coordinates.y
      )
    );

    // change image title to narwhal name that is moused over
    if (onNarwhalLegend.length !== 0) {
      event.target.title = `${onNarwhalLegend[0].name}`;
    }
  };

  const handleFoundNarwhal = () => {};

  const isNarhwalFound = () => {};

  return (
    <div className="app">
      <Header />
      <div className="app-main">
        <img
          className="app-main-image"
          src="https://www.google.com/images/spin-32.gif?a"
          alt="A beach scene with a hidden narwhal"
          onClick={handleCoordinateUpdateFromSelection}
          draggable="false"
          onMouseMove={handleNarwhalLegendNames}
        />
        {isSelected && (
          <Selector
            narwhalChoices={narwhalChoices}
            selectionCoordinates={selectionCoordinates}
            handleFoundNarwhal={handleFoundNarwhal}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
