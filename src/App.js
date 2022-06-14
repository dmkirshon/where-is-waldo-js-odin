import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Selector from "./components/Selector";

import { getStorageFirebaseURL, getCloudStorageDocData } from "./firebase-sw";

function App() {
  const IMAGE_ORIGINAL_WIDTH = 1020;
  const IMAGE_ORIGINAL_HEIGHT = 721;

  // App states
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

  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const [imageScale, setImageScale] = useState(1);

  const [isSelected, setIsSelected] = useState(false);

  const [startTime, setStartTime] = useState(new Date().getTime());

  const [endTime, setEndTime] = useState(0);

  const [gameWon, setGameWon] = useState(false);

  // Update coordinates from click on browser image for selector features
  const handleCoordinateUpdateFromSelection = (event) => {
    const imageParameters = event.target.getBoundingClientRect();
    const imageX = imageParameters.x;
    const imageY = imageParameters.y;
    const imageWidth = imageParameters.width;

    const xCoordinateSelection = event.pageX;
    const yCoordinateSelection = event.pageY;

    setIsSelected((wasSelected) => !wasSelected);
    setSelectionCoordinates({
      x: xCoordinateSelection,
      y: yCoordinateSelection,
    });
    setImageOffset({
      x: imageX,
      y: imageY,
    });

    setImageScale(imageWidth / IMAGE_ORIGINAL_WIDTH);
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

  const handleFoundNarwhal = async (name) => {
    const narwhalFound = await isNarwhalFound(name);
    if (narwhalFound) {
      setNarwhalChoices((prevNarwhalChoices) => {
        return prevNarwhalChoices.map((narwhalChoice) => {
          if (narwhalChoice.name === name) {
            return { ...narwhalChoice, isFound: narwhalFound };
          }
          return narwhalChoice;
        });
      });
    }

    setIsSelected(false);
  };

  const isNarwhalFound = async (name) => {
    const narwhalData = await getCloudStorageDocData(name, "narwhal");
    const narwhalCoordinateX = narwhalData.coordinateX;
    const narwhalCoordinateY = narwhalData.coordinateY;

    const isNarwhalAtSelection = isMouseNearCoordinates(
      selectionCoordinates.x - imageOffset.x - window.scrollX,
      selectionCoordinates.y - imageOffset.y - window.scrollY,
      narwhalCoordinateX * imageScale,
      narwhalCoordinateY * imageScale,
      20
    );

    return isNarwhalAtSelection;
  };

  const currentTimerTime = () => {
    const currentTime = new Date().getTime();
    const timerTime = currentTime - startTime;
    return timerTime;
  };

  // Verify if game is over by checking that all narwhals have been found
  const isGameOver = useCallback(() => {
    const narwhalsFound = narwhalChoices.reduce(
      (total, narwhalChoice) => (narwhalChoice.isFound ? total + 1 : total),
      0
    );

    return narwhalsFound === narwhalChoices.length;
  }, [narwhalChoices]);

  // End the game if the game is over
  useEffect(() => {
    if (isGameOver()) {
      setGameWon(true);
    }
  }, [isGameOver, narwhalChoices]);

  // Congratulate the user if they have won the game
  useEffect(() => {
    if (gameWon) {
      console.log("You win!");
      setEndTime(currentTimerTime());
    }
  }, [currentTimerTime, gameWon]);

  return (
    <div className="app">
      <Header gameWon={gameWon} currentTimerTime={currentTimerTime} />
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
            imageOffset={imageOffset}
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
