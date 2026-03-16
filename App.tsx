
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MyShelf from './pages/MyShelf';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import Chat from './pages/Chat';
import Wallet from './pages/Wallet';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { authService } from './services/authService';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuth(authenticated);
    if (!authenticated) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (isAuth === null) return null; // Prevent flicker or early render
  return isAuth ? <>{children}</> : null;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Navigate to="/home" replace /></PrivateRoute>} />
      <Route path="/intro" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
      <Route path="/minha-estante" element={<PrivateRoute><MyShelf /></PrivateRoute>} />
      <Route path="/cadastrar-livro" element={<PrivateRoute><AddBook /></PrivateRoute>} />
      <Route path="/livro/:id" element={<PrivateRoute><BookDetails /></PrivateRoute>} />
      <Route path="/chat/:tradeId" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/chats" element={<PrivateRoute><Chat tradeId="mock" /></PrivateRoute>} />
      <Route path="/carteira" element={<PrivateRoute><Wallet /></PrivateRoute>} />
      <Route path="/meu-perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;