import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import CoolClock from "./components/CoolClock/CoolClock.js";
import NavBar from "./components/NavBar/NavBar.js";
// import Card from "./components/Card.js";
// import background_img from "./assets/spongebob-background.png";
// import profile_img from "./assets/spongebob-profile.png";
// import title_img from "./assets/spongebob-title.png";

function App() {
  // to try out the components:
  return (
    <>
      {
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="App">
                  <header className="App-header ">
                    <NavBar />
                    <CoolClock widthValue={50} widthParam="vmin" />
                    {
                      // clocks' size is being alterd by navbar already - it was made in order to be inside navbar.
                      // if you'd like to use clock on it's own, use it without the spasific navbar shown here - as it contains functions built purly to alter it
                      // (the change is due to the properties in :root effecting all css of modules & components - thous the change to both)
                    }
                  </header>
                </div>
              }
            />

            <Route path="*" to="/" />
          </Routes>
        </BrowserRouter>
        // exsample with routing - to test NavBar
      }

      {/* {<div className="App">
              <header className="App-header ">
                <NavBar />
                <CoolClock widthValue={50} widthParam="vmin" />
                {
                  // clocks' size is being alterd by navbar already - it was made in order to be inside navbar. 
                  // if you'd like to use clock on it's own, use it without the spasific navbar shown here - as it contains functions built purly to alter it 
                  // (the change is due to the properties in :root effecting all css of modules & components - thous the change to both)
                }
              </header>
            </div>
    // example without routing - for general use
    } */}
    </>
  );
}

export default App;
