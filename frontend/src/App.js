import React from 'react';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StorysPage from './pages/StorysPage';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout'; 
import SecLayout from './layouts/SecLayout';
import ThirdLayout from './layouts/ThirdLayout';
import Profile from './pages/Profile';
import CreateStory from './pages/CreateStory';



function App() {
    return (
        <Router>
          
                <Routes>
                    <Route path="/" element={  <MainLayout><HomePage /></MainLayout>} />
                    <Route path="/StorysPage" element={<SecLayout> <StorysPage /></SecLayout> } />
                    <Route path="/profile/:username" element={<SecLayout> <Profile /></SecLayout> } />
                    <Route path="/login" element={<ThirdLayout><LoginPage /></ThirdLayout>} />
                    <Route path="/register" element={<ThirdLayout><RegisterPage /></ThirdLayout>} />
                  
          <Route path="/create-story" element={<CreateStory />} />
          {/* Rota para páginas não encontradas */}
          {/* <Route path="*" element={<NotFound />} /> */}
                    
                </Routes>
       
        </Router>
    );
}

export default App;
