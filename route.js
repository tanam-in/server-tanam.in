const {register,login,home,classes,profil,moduleContent,detail_kelas,forum,informasi_gizi} = require("./handler");

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
    },
        {
        method: 'GET',
        path: '/kelas/{id}',
        handler: detail_kelas
    },
    {
        method: 'GET',
        path: '/kelas/{id}/forum',
        handler: forum
    },  
    {
        method: 'GET',
        path: '/deteksi/{id}/informations',
        handler: informasi_gizi
    }
  ];

module.exports = routes;
