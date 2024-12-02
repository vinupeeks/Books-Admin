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
    MEMBER_SHIP: '/membership/details',
    MEMBER_SHIP_BY_ID: '/membership/details/:id',
    MEMBERS_INDIVUDAL: '/members/indivual',

    MEMBER_BOOK_ISSUE_DETAILS: '/issues/member',
    BOOK_ISSUE_API: '/issues/issue',
    BOOK_RETURN_API: '/issues/return',
    BOOK_ISSUING: '/book/issuing',

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
