import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthModal from './components/auth/AuthModal';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MyShelf from './pages/MyShelf';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Exchanges from './pages/Exchanges';
import Wallet from './pages/Wallet';
import { authService } from './services/authService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/intro" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/minha-estante" element={<ProtectedRoute><MyShelf /></ProtectedRoute>} />
        <Route path="/cadastrar-livro" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/livro/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="/meu-perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/trocas" element={<ProtectedRoute><Exchanges /></ProtectedRoute>} />
        <Route path="/troca/:tradeId" element={<ProtectedRoute><Exchanges /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:tradeId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/carteira" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <AuthModal />
    </>
  );
};

export default App;
