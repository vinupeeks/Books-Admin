import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import NotFound from './components/NotFound';
import BookCart from './pages/BookCart';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/home/Navbar';
import LogDetails from './pages/LogDetails';
import UsersList from './pages/UsersList';
import Profile from './pages/Profile';
import { ViewProvider } from './ViewContext';
import ContactPage from './components/home/ContactPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('BooksAdminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('BooksAdminToken');
    setIsAuthenticated(false);
  };

  return (
    <ViewProvider>
      <>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path="/books/create" element={<PrivateRoute element={<CreateBook />} />} />
          <Route path='/books/details/:id' element={<ShowBook />} />
          <Route path="/books/edit/:id" element={<PrivateRoute element={<EditBook />} />} />
          <Route path='/books/delete/:id' element={<PrivateRoute element={<DeleteBook />} />} />
          <Route path='/admin/users' element={<PrivateRoute element={<UsersList />} />} />
          <Route path='/admin/profile' element={<PrivateRoute element={<Profile />} />} />
          <Route path='/cart' element={<PrivateRoute element={<BookCart />} />} />
          <Route path='/contact' element={<PrivateRoute element={<ContactPage />} />} />
          <Route path='/logout' element={<LogDetails handleLogout={handleLogout} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </></ViewProvider>
  );
};

export default App;
