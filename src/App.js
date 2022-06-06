import { useEffect } from "react";
import "./App.css";
import {
  firebaseApp,
  dbFirebaseApp,
  getStorageFirebaseURL,
} from "./firebase-sw";

function App() {
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
      />
    </div>
  );
}

export default App;
