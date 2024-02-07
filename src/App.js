import "./App.css";
import CoolClock from "./components/CoolClock/CoolClock.js";
// import Card from "./components/Card.js";
// import background_img from "./assets/spongebob-background.png";
// import profile_img from "./assets/spongebob-profile.png";
// import title_img from "./assets/spongebob-title.png";

function App() {
  // to try out the components:
  return (
    <div className="App">
      <header className="App-header ">
        <CoolClock widthValue={40} widthParam="vmax" />
      </header>
    </div>
  );
}

export default App;
