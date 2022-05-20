const {register,login,home} = require("./handler");

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
    }
  ];

module.exports = routes;