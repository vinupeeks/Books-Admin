import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import DashBoard from './components/DashBoard/DashBoard';
import IndividualMemberShip from './components/MemberShip/IndividualMemberShip';
import FamilyMemberShip from './components/MemberShip/FamilyMemberShip';
import MembersList from './components/MembersList/MembersList';
import ShowBook from './components/Books/ShowBook';
import EditBook from './components/Books/EditBook';
import DeleteBook from './components/Books/DeleteBook'; 
import NotFound from './utils/NotFound';
import BasicCard from './components/cart/BookCart';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/navbar/Navbar';
import LogDetails from './components/Log/LogDetails';

import UsersList from './components/UserList/UsersList';
import Profile from './components/Profile/Profile';
import { ViewProvider } from './context/ViewContext.jsx';
import ContactPage from './components/contact/ContactPage';
import CreateBooks from './components/Books/CreateBooks';
import AdminLogin from './components/Log/Login';
import RouteConstants from "./constant/Routeconstant.jsx";
import IssuingBook from './components/BookIssuing/IssuingBook.jsx';
import FamilyMemList from './components/MemberShip/FamilyMemList.jsx';
import LoginPage from './components/Log/LogSam.jsx';

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
          {/* <Route path={RouteConstants.LOGIN} element={<AdminLogin />} /> */}
          <Route path={RouteConstants.LOGIN} element={<LoginPage />} />
          {/* <Route path={RouteConstants.DASHBOARD} element={<PrivateRoute element={<DashBoard />} />} /> */}
          <Route path={RouteConstants.ROOT} element={<PrivateRoute element={<Home />} />} />

          <Route path={RouteConstants.INDIVIDUAL_MEMBERSHIP} element={<PrivateRoute element={<IndividualMemberShip />} />} />
          <Route path={RouteConstants.FAMILY_MEMBERSHIP} element={<PrivateRoute element={<FamilyMemberShip />} />} />
          <Route path={RouteConstants.FAMILY_LIST} element={<PrivateRoute element={<FamilyMemList />} />} />

          <Route path={RouteConstants.DASHBOARD} element={<PrivateRoute element={<MembersList />} />} /> 

          <Route path={RouteConstants.BOOKCREATE} element={<PrivateRoute element={<CreateBooks />} />} />
          <Route path={RouteConstants.BOKKSDETAILS} element={<ShowBook />} />
          <Route path={RouteConstants.BOOKSEDIT} element={<PrivateRoute element={<EditBook />} />} />
          <Route path={RouteConstants.BOOKSDELETE} element={<PrivateRoute element={<DeleteBook />} />} />
          <Route path={RouteConstants.BOOK_ISSUING} element={<PrivateRoute element={<IssuingBook />} />} />


          <Route path={RouteConstants.USERSLIST} element={<PrivateRoute element={<UsersList />} />} />
          <Route path={RouteConstants.ADMINPROFILE} element={<PrivateRoute element={<Profile />} />} />
          <Route path={RouteConstants.CART} element={<PrivateRoute element={<BasicCard />} />} />
          <Route path={RouteConstants.CONTACT} element={<PrivateRoute element={<ContactPage />} />} />
          <Route path={RouteConstants.LOGOUT} element={<LogDetails handleLogout={handleLogout} />} />
          <Route path={RouteConstants.NOTFOUND} element={<NotFound />} />
        </Routes>
      </>
    </ViewProvider>
  );
};

export default App;
