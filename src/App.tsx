import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Terms/HomePage';
import ProfilePage from './components/User/ProfilePage';
import DashboardPage from './components/Admin/DashboardPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Navbar from './components/Navbar';
import TermForm from './components/Terms/TermForm';
import { AuthProvider } from './contexts/authContext';
import UsersPage from './components/Admin/UsersPage';
import TermsPage from './components/Admin/TermsPage';
import ProtectedRoute from './components/ProtectedRoute';
import TermDetails from './components/Terms/TermDetails';
import UpdateProfile from './components/User/UpdateProfile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms/:id" element={<TermDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<DashboardPage />} roles={['admin']} />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute element={<UsersPage />} roles={['admin']} />}
          />
          <Route
            path="/terms"
            element={<ProtectedRoute element={<TermsPage />} roles={['admin','moderator']} />}
          />
          <Route
            path="/new-term"
            element={<ProtectedRoute element={<TermForm />} />}
          />
          <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfile/>}/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
