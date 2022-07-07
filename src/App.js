import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Selector from "./components/Selector";
import WinnerNameRequest from "./components/WinnerNameRequest";
import WinnerBoard from "./components/WinnerBoard";

import {
  getStorageFirebaseURL,
  getCloudStorageDocData,
  updateCloudStorageWithDocData,
} from "./firebase-sw";

function App() {
  const IMAGE_ORIGINAL_WIDTH = 1020;
  const IMAGE_ORIGINAL_HEIGHT = 721;

  // App states
  const initialState = {
    narwhalChoices: [
      { name: "Noah", isFound: false, legendCoordinates: { x: 75, y: 160 } },
      { name: "Niall", isFound: false, legendCoordinates: { x: 75, y: 190 } },
      { name: "Nicola", isFound: false, legendCoordinates: { x: 85, y: 230 } },
      { name: "Nigel", isFound: false, legendCoordinates: { x: 80, y: 265 } },
      { name: "Natalie", isFound: false, legendCoordinates: { x: 80, y: 295 } },
      { name: "Nancy", isFound: false, legendCoordinates: { x: 80, y: 320 } },
    ],
    selectionCoordinates: {
      x: 0,
      y: 0,
    },
    imageOffset: { x: 0, y: 0 },
    imageScale: 1,
    isSelected: false,
    startTime: new Date().getTime(),
    scoreTime: 0,
    winnerName: "",
    submittedName: false,
    gameWon: false,
  };

  const [narwhalChoices, setNarwhalChoices] = useState(
    initialState.narwhalChoices
  );

  const [selectionCoordinates, setSelectionCoordinates] = useState(
    initialState.selectionCoordinates
  );

  const [imageOffset, setImageOffset] = useState(initialState.imageOffset);

  const [imageScale, setImageScale] = useState(initialState.imageScale);

  const [isSelected, setIsSelected] = useState(initialState.isSelected);

  const [startTime, setStartTime] = useState(initialState.startTime);

  const [scoreTime, setScoreTime] = useState(initialState.scoreTime);

  const [winnerName, setWinnerName] = useState(initialState.winnerName);

  const [submittedName, setSubmittedName] = useState(
    initialState.submittedName
  );

  const [gameWon, setGameWon] = useState(initialState.gameWon);

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
    const imageWidth = imagePosition.width;
    const imageScale = imageWidth / IMAGE_ORIGINAL_WIDTH;

    // if around narwhal reference coordinates
    const onNarwhalLegend = narwhalChoices.filter((narwhalChoice) =>
      isMouseNearCoordinates(
        mouseOverAdjX,
        mouseOverAdjY,
        narwhalChoice.legendCoordinates.x * imageScale,
        narwhalChoice.legendCoordinates.y * imageScale
      )
    );

    // add text overlay to narwhal name that is moused over
    if (onNarwhalLegend.length !== 0) {
      event.target.title = `${onNarwhalLegend[0].name}`;
    } else {
      event.target.title = ``;
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
    const narwhalData = await getCloudStorageDocData("narwhal");

    const chosenNarwhalData = narwhalData.reduce((chosenNarwhal, narwhal) => {
      return narwhal.name === name ? narwhal : chosenNarwhal;
    });

    const narwhalCoordinateX = chosenNarwhalData.coordinateX;
    const narwhalCoordinateY = chosenNarwhalData.coordinateY;

    const isNarwhalAtSelection = isMouseNearCoordinates(
      selectionCoordinates.x - imageOffset.x - window.scrollX,
      selectionCoordinates.y - imageOffset.y - window.scrollY,
      narwhalCoordinateX * imageScale,
      narwhalCoordinateY * imageScale,
      20
    );

    return isNarwhalAtSelection;
  };

  const currentTimerTime = useCallback(() => {
    const currentTime = new Date().getTime();
    const timerTime = currentTime - startTime;
    return timerTime;
  }, [startTime]);

  // Update the name of the winner entered into the input
  const handleWinnerNameUpdate = (event) => {
    const winnerNameUpdate = event.target.value;
    setWinnerName(winnerNameUpdate);
  };

  // Send winner's name and time to scores collection in storage
  const submitWinnerDataToStorage = async (event) => {
    event.preventDefault();

    const winnerData = { name: winnerName, time: scoreTime };

    await updateCloudStorageWithDocData(winnerData, "scores");

    setSubmittedName((submittedName) => !submittedName);
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
      setScoreTime(currentTimerTime());
    }
  }, [currentTimerTime, gameWon]);

  const handleResetGame = () => {
    setNarwhalChoices(initialState.narwhalChoices);

    setSelectionCoordinates(initialState.selectionCoordinates);

    setImageOffset(initialState.imageOffset);

    setImageScale(initialState.imageScale);

    setIsSelected(initialState.isSelected);

    setStartTime(new Date().getTime());

    setScoreTime(initialState.scoreTime);

    setWinnerName(initialState.winnerName);

    setSubmittedName(initialState.submittedName);

    setGameWon(initialState.gameWon);
  };

  return (
    <div className="app">
      <Header gameWon={gameWon} currentTimerTime={currentTimerTime} />
      {gameWon && !submittedName && (
        <WinnerNameRequest
          winnerName={winnerName}
          handleWinnerNameUpdate={handleWinnerNameUpdate}
          submitWinnerDataToStorage={submitWinnerDataToStorage}
        />
      )}
      {submittedName && <WinnerBoard handleResetGame={handleResetGame} />}
      <div className={`app-main ${gameWon ? "app-game-won" : ""}`}>
        <img
          className={`app-main-image ${gameWon ? "app-game-won" : ""}`}
          src="https://www.google.com/images/spin-32.gif?a"
          alt="A beach scene with a hidden narwhal"
          onClick={handleCoordinateUpdateFromSelection}
          draggable="false"
          onMouseMove={handleNarwhalLegendNames}
        />
        {!gameWon && isSelected && (
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
