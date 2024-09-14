/*

landing page 
upload video
view video with chat and all that

*/


import { ConvexProvider, ConvexReactClient } from "convex/react";
import LandingPage from "./landingPage";
import VideoPage from "./videoPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/video" element={<VideoPage />} />
        </Routes>
      </Router>
    </ConvexProvider>
  );
}

export default App;
