import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateScriptPage from './pages/CreateScriptPage';
import ScriptWorkspace from './pages/ScriptWorkspace';
import MyScreenplays from './pages/MyScreenplays';

import CharacterStudio from './pages/CharacterStudio';
import ProductionHub from './pages/ProductionHub';

function App() {
  const [scriptData, setScriptData] = useState(null);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/characters" element={<CharacterStudio />} />
          <Route path="/production" element={<ProductionHub />} />

          <Route
            path="/create"
            element={
              <CreateScriptPage
                setScriptData={setScriptData}
              />
            }
          />
          <Route path="/scripts" element={<MyScreenplays />} />
          <Route path="/scripts/:id" element={<ScriptWorkspace />} />

          {/* Workspace fallback (though we prefer /scripts/:id now) */}
          <Route
            path="/workspace"
            element={
              scriptData ? (
                <ScriptWorkspace scriptData={scriptData} />
              ) : (
                <Navigate to="/create" replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
