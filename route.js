const {register,login,home,classes,profil,moduleContent,detail_kelas,forum,informasi_gizi,profilEdit} = require("./handler");

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
        method: 'GET',
        path: '/module/{classid}/{modulid}',
        handler: moduleContent
    },
        {
        method: 'GET',
        path: '/module/{classid}',
        handler: detail_kelas
    },
    {
        method: 'GET',
        path: '/module/{classid}/forum',
        handler: forum
    },  
    {
        method: 'GET',
        path: '/deteksi/{id}/informations',
        handler: informasi_gizi
    },
    {
        method: 'POST',
        path: '/editProfile',
        handler: profilEdit,
        options: {
            payload: {
                parse: true,
                multipart: {
                    output: 'stream'
                },
                maxBytes: 1000 * 1000 * 5
            }
        }
    }
  ];

module.exports = routes;
