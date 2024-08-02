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
import QuizPage from './components/Quiz/QuizPage';
import FlashcardSerieParams from './components/Quiz/FlashcardSerieParams';
import BookmarksPage from './components/Terms/BookmarksPage';
import UserProfilePage from './components/User/UserProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen w-screen flex justify-center bg-background text-text font-sans">
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<UserProfilePage />} />
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
              element={<ProtectedRoute element={<DashboardPage />} allowedRoles={['admin']} />}
            />
            <Route
              path="/users"
              element={<ProtectedRoute element={<UsersPage />} allowedRoles={['admin']} />}
            />
            <Route
              path="/terms/flashcard-serie"
              element={<ProtectedRoute element={<FlashcardSerieParams />} allowedRoles={['admin', 'moderator', 'user']} />}
            />
            <Route
              path="/terms/quiz"
              element={<ProtectedRoute element={<QuizPage />} allowedRoles={['admin', 'moderator', 'user']} />}
            />
            <Route
              path="/terms"
              element={<ProtectedRoute element={<TermsPage />} allowedRoles={['admin', 'moderator']} />}
            />
            <Route
              path="/new-term"
              element={<ProtectedRoute element={<TermForm />} />}
            />
            <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfile />} />} />
            <Route path='/bookmarks' element={<ProtectedRoute element={<BookmarksPage />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
