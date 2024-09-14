/*

landing page 
upload video
view video with chat and all that

*/


import LandingPage from "./landingPage";
import VideoPage from "./videoPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
