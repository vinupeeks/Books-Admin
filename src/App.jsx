import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BooksList from './components/Books/BooksList.jsx';
// import IndividualMemberShip from './components/MemberShip/IndividualMemberShip';
import MemberShipCreation from './components/MemberShip/MemberShipCreation.jsx';
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
// import AdminLogin from './components/Log/Login';
import RouteConstants from "./constant/Routeconstant.jsx";
import IssuingBook from './components/BookIssuing/IssuingBook.jsx'; 
import AdminLogin from './components/Log/AdminLogin.jsx';
import Dashboard from './components/DashBoard/DashBoard.jsx';
import SideMenu from './components/navbar/sideMenu.jsx';
import { getAuthToken } from './utils/TokenHelper.jsx';
import { useSelector } from 'react-redux';
import IssuedList from './components/BookIssuing/IssuedList.jsx';

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

  const isAuthenthicated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <ViewProvider>
      {
        !isAuthenthicated ?
          <>
            <AdminLogin />
          </> :
          <>
            <Routes>
              <Route path={RouteConstants.ROOT} element={<SideMenu />}>
                <Route path={RouteConstants.DASHBOARD} element={<PrivateRoute element={<Dashboard />} />} />

                <Route path={RouteConstants.BOOKS} element={<PrivateRoute element={<BooksList />} />} />
                <Route path={RouteConstants.ISSUEDLIST} element={<PrivateRoute element={<IssuedList />} />} />

                <Route path={RouteConstants.CREATE_MEMBERSHIP} element={<PrivateRoute element={<MemberShipCreation />} />} /> 

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
              </Route>
            </Routes>
          </>
      }
    </ViewProvider>
  );
};

export default App;
