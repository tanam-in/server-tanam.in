const {register,login,home,classes,profil,moduleContent} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: register
    },
    {
        method: 'POST',
        path: '/login',
        handler: login
    },
    {
        method: 'POST',
        path: '/home',
        handler: home
    },
    {
        method: 'POST',
        path: '/class',
        handler: classes
    },
    {
        method: 'POST',
        path: '/profile',
        handler: profil
    },
    {
        method: 'POST',
        path: '/module',
        handler: moduleContent
    }
  ];

module.exports = routes;