
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InteractiveDemo from './pages/InteractiveDemo';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/presentation" element={<LandingPage />} />
          <Route path="/demo" element={<InteractiveDemo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
