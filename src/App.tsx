import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import HomePage from './components/Terms/HomePage';
import TermForm from './components/Terms/TermForm';
import TermDetails from './components/Terms/TermDetails';
import ModerationPage from './components/Terms/ModerationPage';
import ProfilePage from './components/User/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms/new" element={<TermForm />} />
        <Route path="/terms/:id/edit" element={<TermForm />} />
        <Route path="/terms/:id" element={<TermDetails />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
