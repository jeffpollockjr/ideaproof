import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyIdeas from './pages/MyIdeas';
import CreateIdea from './pages/CreateIdea';
import IdeaDetail from './pages/IdeaDetail';
import Marketplace from './pages/Marketplace';
import IdeaPublicPage from './pages/IdeaPublicPage';
import BookCall from './pages/BookCall';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Marketplace is public */}
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<IdeaPublicPage />} />
      <Route path="/marketplace/:id/book" element={<BookCall />} />

      {/* Protected seller routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ideas" element={<MyIdeas />} />
        <Route path="ideas/new" element={<CreateIdea />} />
        <Route path="ideas/:id" element={<IdeaDetail />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);

export default App;
