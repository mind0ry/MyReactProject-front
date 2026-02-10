import {BrowserRouter as Router, Routes, Route} from "react-router";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import MusicList from "./components/music/MusicList";

function App() {
  return (
      <Router>
          <Header/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/music/list" element={<MusicList/>}/>
          </Routes>
          <Footer/>
      </Router>

  );
}

export default App;
