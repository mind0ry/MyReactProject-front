import {BrowserRouter as Router, Routes, Route} from "react-router";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/layout/Home";
import MusicList from "./components/music/MusicList";
import MusicDetail from "./components/music/MusicDetail";
import ChatBot from "./components/chat/ChatBot";
import BoardList from "./components/board/BoardList";
import BoardInsert from "./components/board/BoardInsert";
import BoardDetail from "./components/board/BoardDetail";
import BoardUpdate from "./components/board/BoardUpdate";
import BoardDelete from "./components/board/BoardDelete";

function App() {
  return (
      <Router>
          <Header/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/music/list" element={<MusicList/>}/>
              <Route path="/music/detail/:no" element={<MusicDetail/>}/>
              <Route path="/board/list" element={<BoardList/>}/>
              <Route path="/board/insert" element={<BoardInsert/>}/>
              <Route path="/board/detail/:no" element={<BoardDetail/>}/>
              <Route path="/board/update/:no" element={<BoardUpdate/>}/>
              <Route path="/board/delete/:no" element={<BoardDelete/>}/>
              <Route path="/chatbot" element={<ChatBot/>}/>
          </Routes>
          <Footer/>
      </Router>

  );
}

export default App;
