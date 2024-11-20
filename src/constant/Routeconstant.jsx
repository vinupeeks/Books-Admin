const RouteConstants = {
    DASHBOARD: '/',
    ROOT: '/home',
    LOGIN: '/auth/admin/login',
    BOOKS: '/books',
    BOOKSLAST: '/books/last',
    SEARCHEDBOOKS: '/books/searchedBook',

    INDIVIDUAL_MEMBERSHIP: '/membership/indivual',
    FAMILY_MEMBERSHIP: '/membership/family',
    MEMBERS_LIST: '/members',
    MEMBER_SHIP: '/membership/:id',
    MEMBER_SHIP_BY_ID: '/membership/details/:id',
    MEMBERS_INDIVUDAL: '/members/indivual',

    BOOKCREATE: '/books/create',
    BOKKSDETAILS: '/books/details/:id',
    BOOKSEDIT: '/books/edit/:id',
    BOOKSDELETE: '/books/delete/:id',
    USERSLIST: '/admin/users',
    ADMINPROFILE: '/admin/profile',
    CART: '/cart',
    CONTACT: '/contact',
    LOGOUT: '/logout',
    NOTFOUND: '*'

};
export default RouteConstants
