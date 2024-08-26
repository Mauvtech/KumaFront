import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import ProfilePage from './components/User/ProfilePage';
import DashboardPage from './components/Admin/DashboardPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Navbar from './components/Navbar';
import TermForm from './components/Terms/TermForm';
import {AuthProvider} from './contexts/authContext';
import UsersPage from './components/Admin/UsersPage';
import TermsPage from './components/Admin/TermsPage';
import ProtectedRoute from './components/ProtectedRoute';
import TermDetails from './components/Terms/TermDetails';
import UpdateProfile from './components/User/UpdateProfile';
import QuizPage from './components/Quiz/QuizPage';
import FlashcardSerieParams from './components/Quiz/FlashcardSerieParams';
import BookmarksPage from './components/Terms/BookmarksPage';
import UserProfilePage from './components/User/UserProfilePage';
import { Helmet } from 'react-helmet';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()


function App() {
    return (
        <AuthProvider>
            <Helmet>
                <title>Kuma - La Révolution dans l'Apprentissage des Langues et la Découverte Culturelle</title>
                <meta name="description" content="Découvrez Kuma, la plateforme ultime pour l'apprentissage des langues, la découverte culturelle, et la promotion des experts. Rejoignez une communauté mondiale et contribuez à la préservation des langues." />
                <meta name="keywords" content="apprentissage des langues, découverte culturelle, experts linguistiques, préservation des langues, communauté linguistique, éducation personnalisée" />

                <meta property="og:title" content="Kuma - La Révolution dans l'Apprentissage des Langues et la Découverte Culturelle" />
                <meta property="og:description" content="Kuma offre une expérience unique en combinant apprentissage personnalisé, promotion des experts, et un écosystème social dynamique. Rejoignez le mouvement et participez à la préservation des langues." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="URL-to-your-image" />
                <meta property="og:url" content="https://www.kumaverse.com" />

                <link rel="canonical" href="https://www.kumaverse.com" />
            </Helmet>

            <QueryClientProvider client={queryClient}>
                <Router>
                    <Navbar/>
                    <div className="min-h-screen w-full flex justify-center items-center  text-text font-sans">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/profile/:username" element={<UserProfilePage/>}/>
                            <Route path="/terms/:id" element={<TermDetails/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>

                            {/* Protected Routes */}
                            <Route
                                path="/profile"
                                element={<ProtectedRoute element={<ProfilePage/>}/>}
                            />
                            <Route
                                path="/dashboard"
                                element={<ProtectedRoute element={<DashboardPage/>} allowedRoles={['admin']}/>}
                            />
                            <Route
                                path="/users"
                                element={<ProtectedRoute element={<UsersPage/>} allowedRoles={['admin']}/>}
                            />
                            <Route
                                path="/terms/flashcard-serie"
                                element={<ProtectedRoute element={<FlashcardSerieParams/>}
                                                         allowedRoles={['admin', 'moderator', 'user']}/>}
                            />
                            <Route
                                path="/terms/quiz"
                                element={<ProtectedRoute element={<QuizPage/>}
                                                         allowedRoles={['admin', 'moderator', 'user']}/>}
                            />
                            <Route
                                path="/terms"
                                element={<ProtectedRoute element={<TermsPage/>} allowedRoles={['admin', 'moderator']}/>}
                            />
                            <Route path="/new-term" element={<ProtectedRoute element={<TermForm/>}/>}/>
                            <Route path="/update-profile" element={<ProtectedRoute element={<UpdateProfile/>}/>}/>
                            <Route path='/bookmarks' element={<ProtectedRoute element={<BookmarksPage/>}/>}/>
                        </Routes>
                    </div>
                </Router>
            </QueryClientProvider>

        </AuthProvider>
    );
}

export default App;
