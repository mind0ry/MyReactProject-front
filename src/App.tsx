import {BrowserRouter as Router, Routes, Route} from "react-router";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import MusicList from "./components/music/MusicList";
import MusicDetail from "./components/music/MusicDetail";
import ChatBot from "./components/chat/ChatBot";

function App() {
  return (
      <Router>
          <Header/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/music/list" element={<MusicList/>}/>
              <Route path="/music/detail/:no" element={<MusicDetail/>}/>
              <Route path="/chatbot" element={<ChatBot/>}/>
          </Routes>
          <Footer/>
      </Router>

  );
}

export default App;
