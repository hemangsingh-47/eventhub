import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/bookmarks" element={
                  <ProtectedRoute><BookmarksPage /></ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute role="student"><LeaderboardPage /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute role="organizer"><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/create-event" element={
                  <ProtectedRoute role="organizer"><CreateEventPage /></ProtectedRoute>
                } />
                <Route path="/edit-event/:id" element={
                  <ProtectedRoute role="organizer"><EditEventPage /></ProtectedRoute>
                } />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
