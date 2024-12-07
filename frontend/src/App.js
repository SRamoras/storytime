// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPageMain';
import RegisterPage from './pages/RegisterPage';
import StorysPage from './pages/StorysPage';
import HomePage from './pages/HomePagee';
import MainPageLayout from './layouts/MainPageLayout'; 
import SecLayout from './layouts/SecLayout';
import ThirdLayout from './layouts/ThirdLayout';
import Profile from './pages/Profile';
import CreateStory from './pages/CreateStory';
import Story from './pages/Story';
import NotFound from './pages/NotFound'; // Importação da página 404

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                  
                  <Route path="/profile/:username" element={<Profile />}/>
                  <Route path="/create-story" element={<CreateStory />} />
                  <Route path="/story/:id" element={<Story />} /> 
              </Route>

              {/* Rota para páginas não encontradas */}
              <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
      </Router>
  );
}

export default App;
