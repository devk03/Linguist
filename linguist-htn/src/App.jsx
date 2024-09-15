import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './landingPage';
//import VideoPage from './videoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/video" element={<VideoPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;