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
import Chat from './pages/Chat';
import Exchanges from './pages/Exchanges';
import Wallet from './pages/Wallet';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/intro" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/minha-estante" element={<MyShelf />} />
        <Route path="/cadastrar-livro" element={<AddBook />} />
        <Route path="/livro/:id" element={<BookDetails />} />
        <Route path="/meu-perfil" element={<Navigate to="/minha-estante" replace />} />
        <Route path="/trocas" element={<Exchanges />} />
        <Route path="/troca/:tradeId" element={<Exchanges />} />
        <Route path="/chats" element={<Chat />} />
        <Route path="/chat/:tradeId" element={<Chat />} />
        <Route path="/carteira" element={<Wallet />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <AuthModal />
    </>
  );
};

export default App;
