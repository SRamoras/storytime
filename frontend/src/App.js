import React from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPageMain'; // Ajuste o caminho conforme a estrutura de pastas


import RegisterPage from './pages/RegisterPage';
import StorysPage from './pages/StorysPage';
import HomePage from './pages/HomePage';
import MainPageLayout from './layouts/MainPageLayout'; 
import SecLayout from './layouts/SecLayout';
import ThirdLayout from './layouts/ThirdLayout';
import Profile from './pages/Profile';
import CreateStory from './pages/CreateStory';
import Story from './pages/Story';

function App() {
  return (
      <Router>
          <Routes>
              <Route element={<MainPageLayout />}>
                  <Route path="/" element={<HomePage />} />
              </Route>

              <Route path="/login" element={<ThirdLayout />}>
                  <Route index element={<LoginPage />} />
              </Route>
              
              <Route path="/register" element={<ThirdLayout />}>
                  <Route index element={<RegisterPage />} />
              </Route>

              <Route element={<SecLayout />}>
                  <Route path="/StorysPage" element={<StorysPage />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/create-story" element={<CreateStory />} />
                  <Route path="/story/:id" element={<Story />} /> 
              </Route>
          </Routes>
      </Router>
  );
}


export default App;
